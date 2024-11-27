#[macro_use]
#[cfg(test)]
mod tests;

use std::collections::BTreeMap;
use git2::{Repository};
use rocket::State;
use rocket::fs::{FileServer, relative, NamedFile, TempFile};
use rocket::{Request, get, post, routes, catch, catchers, uri, FromForm};
use rocket::response::{status, Redirect};
use rocket::http::{Status, ContentType};
use rocket::form::Form;
use std::io::Write;
use std::path::{PathBuf, Components, Path};
use std::sync::atomic::{AtomicBool, Ordering};
use std::{fs, env};
use std::process::exit;
use hallomai::transform;
use home::home_dir;
use serde::{Serialize, Deserialize};
use serde_json::{json, Map, Value};
use copy_dir::copy_dir;

#[derive(Serialize, Deserialize)]
struct AppSettings {
    client_dir: String,
    repo_dir: String,
    resources_dir: String,
    languages: Vec<String>,
}

// CONSTANTS AND STATE

const REACT_STATIC_PATH: &str = relative!("../client/build");
static NET_IS_ENABLED: AtomicBool = AtomicBool::new(false);

// UTILITY FUNCTIONS

fn os_slash_str() -> &'static str {
    match env::consts::OS {
        "windows" => "\\",
        _ => "/"
    }
}

fn forbidden_path_strings() -> Vec<String> {
    Vec::from([
        "..".to_string(),
        "~".to_string(),
        "/".to_string(),
        "\\".to_string(),
        "&".to_string(),
        "*".to_string(),
        "+".to_string(),
        "|".to_string(),
        " ".to_string(),
        "?".to_string(),
        "#".to_string(),
        "%".to_string(),
        "{".to_string(),
        "}".to_string(),
        "<".to_string(),
        ">".to_string(),
        "$".to_string(),
        "!".to_string(),
        "'".to_string(),
        "\"".to_string(),
        ":".to_string(),
        ";".to_string(),
        "`".to_string(),
        "=".to_string()
    ])
}

fn mime_types() -> BTreeMap<String, ContentType> {
    BTreeMap::from([
        ("aac".to_string(), ContentType::AAC),
        ("bin".to_string(), ContentType::Binary),
        ("bmp".to_string(), ContentType::BMP),
        ("css".to_string(), ContentType::CSS),
        ("csv".to_string(), ContentType::CSV),
        ("flac".to_string(), ContentType::FLAC),
        ("gif".to_string(), ContentType::GIF),
        ("gz".to_string(), ContentType::GZIP),
        ("htm".to_string(), ContentType::HTML),
        ("html".to_string(), ContentType::HTML),
        ("ico".to_string(), ContentType::Icon),
        ("ics".to_string(), ContentType::Calendar),
        ("jpeg".to_string(), ContentType::JPEG),
        ("jpg".to_string(), ContentType::JPEG),
        ("js".to_string(), ContentType::JavaScript),
        ("md".to_string(), ContentType::Markdown),
        ("mov".to_string(), ContentType::MOV),
        ("mp4".to_string(), ContentType::MP4),
        ("mpeg".to_string(), ContentType::MPEG),
        ("mpeg4".to_string(), ContentType::MP4),
        ("mpg".to_string(), ContentType::MPEG),
        ("ogg".to_string(), ContentType::OGG),
        ("ogv".to_string(), ContentType::OGG),
        ("otf".to_string(), ContentType::OTF),
        ("pdf".to_string(), ContentType::PDF),
        ("png".to_string(), ContentType::PNG),
        ("svg".to_string(), ContentType::SVG),
        ("tar".to_string(), ContentType::TAR),
        ("tif".to_string(), ContentType::TIFF),
        ("tiff".to_string(), ContentType::TIFF),
        ("tsv".to_string(), ContentType::CSV),
        ("ttf".to_string(), ContentType::TTF),
        ("txt".to_string(), ContentType::Plain),
        ("usfm".to_string(), ContentType::Plain),
        ("usj".to_string(), ContentType::JSON),
        ("usx".to_string(), ContentType::XML),
        ("vrs".to_string(), ContentType::Plain),
        ("wasm".to_string(), ContentType::WASM),
        ("wav".to_string(), ContentType::WAV),
        ("weba".to_string(), ContentType::WEBA),
        ("webm".to_string(), ContentType::WEBM),
        ("webp".to_string(), ContentType::WEBP),
        ("woff".to_string(), ContentType::WOFF),
        ("woff2".to_string(), ContentType::WOFF2),
        ("xml".to_string(), ContentType::XML),
        ("zip".to_string(), ContentType::ZIP)
    ])
}

#[derive(Serialize, Deserialize)]
struct JsonDataResponse {
    is_good: bool,
    reason: String,
}
#[derive(Serialize, Deserialize)]
struct JsonNetStatusResponse {
    is_enabled: bool,
}

fn check_path_components(path_components: &mut Components<'_>) -> bool {
    let mut ret = true;
    if path_components.clone().collect::<Vec<_>>().len() < 3 {
        return false;
    }
    for path_component in path_components {
        let path_string = path_component.clone().as_os_str().to_str().unwrap().to_string();
        if path_string.starts_with(".") {
            return false;
        }
        for forbidden_string in forbidden_path_strings() {
            if path_string.contains(&forbidden_string) {
                ret = false;
                break;
            }
        }
    }
    ret
}
fn check_path_string_components(path_string: String) -> bool {
    let mut ret = true;
    if path_string.starts_with("/") {
        return false;
    }
    let path_string_parts = path_string.split("/");
    for path_string_part in path_string_parts {
        if path_string_part.len() < 2 {
            return false;
        }
        if path_string_part.starts_with(".") {
            return false;
        }
        for forbidden_string in forbidden_path_strings() {
            if path_string_part.contains(&forbidden_string) {
                ret = false;
                break;
            }
        }
    }
    ret
}

fn make_json_data_response(is_good: bool, reason: String) -> String {
    let jr: JsonDataResponse = JsonDataResponse { is_good, reason };
    serde_json::to_string(&jr).unwrap()
}

fn make_net_status_response(is_enabled: bool) -> String {
    let nsr: JsonNetStatusResponse = JsonNetStatusResponse { is_enabled };
    serde_json::to_string(&nsr).unwrap()
}
fn make_bad_json_data_response(reason: String) -> String {
    make_json_data_response(false, reason)
}

fn make_good_json_data_response(reason: String) -> String {
    make_json_data_response(true, reason)
}
fn home_dir_string() -> String {
    home_dir().unwrap().as_os_str().to_str().unwrap().to_string()
}

// SETTINGS
#[get("/languages")]
fn get_languages(state: &State<AppSettings>) -> status::Custom<(ContentType, String)> {
    let languages = state.languages.clone();
    match serde_json::to_string(&languages) {
        Ok(v) =>
            status::Custom(
                Status::Ok, (
                    ContentType::JSON,
                    v
                ),
            ),
        Err(e) => status::Custom(
            Status::InternalServerError, (
                ContentType::JSON,
                make_bad_json_data_response(
                    format!(
                        "Could not parse language settings as JSON array: {}",
                        e
                    )
                )
            ),
        ),
    }
}

// NETWORK OPERATIONS
#[get("/status")]
fn net_status() -> status::Custom<(ContentType, String)> {
    status::Custom(
        Status::Ok, (
            ContentType::JSON,
            make_net_status_response(NET_IS_ENABLED.load(Ordering::Relaxed))
        ),
    )
}

#[get("/enable")]
fn net_enable() -> status::Custom<(ContentType, String)> {
    NET_IS_ENABLED.store(true, Ordering::Relaxed);
    status::Custom(
        Status::Ok, (
            ContentType::JSON,
            make_good_json_data_response("ok".to_string())
        ),
    )
}

#[get("/disable")]
fn net_disable() -> status::Custom<(ContentType, String)> {
    NET_IS_ENABLED.store(false, Ordering::Relaxed);
    status::Custom(
        Status::Ok, (
            ContentType::JSON,
            make_good_json_data_response("ok".to_string())
        ),
    )
}

// i18n

#[get("/raw")]
async fn raw_i18n(state: &State<AppSettings>) -> status::Custom<(ContentType, String)> {
    let path_to_serve = state.resources_dir.clone() + os_slash_str() + "i18n.json";
    match fs::read_to_string(path_to_serve) {
        Ok(v) => {
            status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    v
                ),
            )
        }
        Err(e) => status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("could not read raw i18n: {}", e).to_string())
            ),
        )
    }
}

#[get("/negotiated/<filter..>")]
async fn negotiated_i18n(state: &State<AppSettings>, filter: PathBuf) -> status::Custom<(ContentType, String)> {
    let path_to_serve = state.resources_dir.clone() + os_slash_str() + "i18n.json";
    let filter_items: Vec<String> = filter.display().to_string().split('/').map(String::from).collect();
    if filter_items.len() > 2 {
        return status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("expected 0 - 2 filter terms, not {}", filter_items.len()).to_string())
            ),
        )
    }
    let mut type_filter: Option<String> = None;
    let mut subtype_filter: Option<String> = None;
    if filter_items.len() > 0 && filter_items[0] != "" {
        type_filter = Some(filter_items[0].clone());
        if filter_items.len() > 1 && filter_items[1] != "" {
            subtype_filter = Some(filter_items[1].clone());
        }
    }
    match fs::read_to_string(path_to_serve) {
        Ok(v) => {
            match serde_json::from_str::<Value>(v.as_str()) {
                Ok(sj) => {
                    let languages = state.languages.clone();
                    let mut negotiated = Map::new();
                    for (i18n_type, subtypes) in sj.as_object().unwrap() {
                        // println!("{}", i18n_type);
                        match type_filter.clone() {
                            Some(v) => {
                                if v != *i18n_type {
                                    continue;
                                }
                            },
                            None => {}
                        }
                        let mut negotiated_types = Map::new();
                        for (i18n_subtype, terms) in subtypes.as_object().unwrap() {
                            // println!("   {}", i18n_subtype);
                            match subtype_filter.clone() {
                                Some(v) => {
                                    if v != *i18n_subtype {
                                        continue;
                                    }
                                },
                                None => {}
                            }
                            let mut negotiated_terms = Map::new();
                            for (i18n_term, term_languages) in terms.as_object().unwrap() {
                                // println!("      {}", i18n_term);
                                let mut negotiated_translations = Map::new();
                                'user_lang: for user_language in languages.clone() {
                                    for (i18n_language, translation) in term_languages.as_object().unwrap() {
                                        // println!("{} {}", i18n_language, languages[0]);
                                        if *i18n_language == user_language {
                                            negotiated_translations.insert("language".to_string(), Value::String(i18n_language.clone()));
                                            negotiated_translations.insert("translation".to_string(), translation.clone());
                                            break 'user_lang;
                                        }
                                    }
                                }
                                negotiated_terms.insert(i18n_term.clone(), Value::Object(negotiated_translations));
                            }
                            negotiated_types.insert(i18n_subtype.clone(), Value::Object(negotiated_terms));
                        }
                        negotiated.insert(i18n_type.clone(), Value::Object(negotiated_types));
                    }
                    status::Custom(
                        Status::Ok,
                        (
                            ContentType::JSON,
                            serde_json::to_string(&negotiated).unwrap()
                        ),
                    )

                },
                Err(e) => {
                    status::Custom(
                        Status::BadRequest,
                        (
                            ContentType::JSON,
                            make_bad_json_data_response(format!("could not parse for negotiated i18n: {}", e).to_string())
                        ),
                    )                }
            }
        }
        Err(e) => status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("could not read for negotiated i18n: {}", e).to_string())
            ),
        )
    }
}

#[get("/flat/<filter..>")]
async fn flat_i18n(state: &State<AppSettings>, filter: PathBuf) -> status::Custom<(ContentType, String)> {
    let path_to_serve = state.resources_dir.clone() + os_slash_str() + "i18n.json";
    let filter_items: Vec<String> = filter.display().to_string().split('/').map(String::from).collect();
    if filter_items.len() > 2 {
        return status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("expected 0 - 2 filter terms, not {}", filter_items.len()).to_string())
            ),
        )
    }
    let mut type_filter: Option<String> = None;
    let mut subtype_filter: Option<String> = None;
    if filter_items.len() > 0 && filter_items[0] != "" {
        type_filter = Some(filter_items[0].clone());
        if filter_items.len() > 1 && filter_items[1] != "" {
            subtype_filter = Some(filter_items[1].clone());
        }
    }
    match fs::read_to_string(path_to_serve) {
        Ok(v) => {
            match serde_json::from_str::<Value>(v.as_str()) {
                Ok(sj) => {
                    let languages = state.languages.clone();
                    let mut flat = Map::new();
                    for (i18n_type, subtypes) in sj.as_object().unwrap() {
                        // println!("{}", i18n_type);
                        match type_filter.clone() {
                            Some(v) => {
                                if v != *i18n_type {
                                    continue;
                                }
                            },
                            None => {}
                        }
                        for (i18n_subtype, terms) in subtypes.as_object().unwrap() {
                            // println!("   {}", i18n_subtype);
                            match subtype_filter.clone() {
                                Some(v) => {
                                    if v != *i18n_subtype {
                                        continue;
                                    }
                                },
                                None => {}
                            }
                            for (i18n_term, term_languages) in terms.as_object().unwrap() {
                                // println!("      {}", i18n_term);
                                'user_lang: for user_language in languages.clone() {
                                    for (i18n_language, translation) in term_languages.as_object().unwrap() {
                                        // println!("{} {}", i18n_language, languages[0]);
                                        if *i18n_language == user_language {
                                            let flat_key = format!("{}:{}:{}", i18n_type.clone(), i18n_subtype.clone(), i18n_term.clone());
                                            flat.insert(flat_key, translation.clone());
                                            break 'user_lang;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    status::Custom(
                        Status::Ok,
                        (
                            ContentType::JSON,
                            serde_json::to_string(&flat).unwrap()
                        ),
                    )

                },
                Err(e) => {
                    status::Custom(
                        Status::BadRequest,
                        (
                            ContentType::JSON,
                            make_bad_json_data_response(format!("could not parse for negotiated i18n: {}", e).to_string())
                        ),
                    )                }
            }
        }
        Err(e) => status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("could not read for negotiated i18n: {}", e).to_string())
            ),
        )
    }
}

// REPO OPERATIONS

#[get("/list-local-repos")]
fn list_local_repos(state: &State<AppSettings>) -> status::Custom<(ContentType, String)> {
    let root_path = state.repo_dir.clone();
    let server_paths = fs::read_dir(root_path).unwrap();
    let mut repos: Vec<String> = Vec::new();
    for server_path in server_paths {
        let uw_server_path = format!("{}", server_path.unwrap().path().display());
        for org_path in fs::read_dir(uw_server_path).unwrap() {
            let uw_org_path = format!("{}", org_path.unwrap().path().display());
            for repo_path in fs::read_dir(uw_org_path).unwrap() {
                repos.push(repo_path.unwrap().path().display().to_string().as_str().to_owned());
            }
        }
    };
    let quoted_repos: Vec<String> = repos
        .into_iter()
        .map(
            |str: String| format!(
                "{}", str.split(os_slash_str()).collect::<Vec<&str>>()[4..].join("/")
            )
        )
        .collect();
    status::Custom(
        Status::Ok,
        (
            ContentType::JSON,
            serde_json::to_string(&quoted_repos).unwrap()
        ),
    )
}

#[get("/add-and-commit/<repo_path..>")]
async fn add_and_commit(state: &State<AppSettings>, repo_path: PathBuf) -> status::Custom<(ContentType, String)> {
    let repo_path_string: String = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string().clone();
    let result = match Repository::open(repo_path_string) {
        Ok(repo) => {
            repo.index()
                .unwrap()
                .add_all(&["."], git2::IndexAddOption::DEFAULT, None)
                .unwrap();
            repo.index()
                .unwrap()
                .write()
                .unwrap();
            let mut index = repo.index().unwrap();
            let oid = index.write_tree().unwrap();
            let signature = repo.signature().unwrap();
            let parent_commit = repo.head().unwrap().peel_to_commit().unwrap();
            let tree = repo.find_tree(oid).unwrap();
            repo.commit(
                Some("HEAD"),
                &signature,
                &signature,
                "Updated by Pithekos",
                &tree,
                &[&parent_commit],
            )
                .unwrap();
            status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    make_good_json_data_response("ok".to_string())
                ),
            )
        }
        Err(e) => status::Custom(
            Status::InternalServerError,
            (
                ContentType::JSON,
                make_bad_json_data_response(format!("could not add/commit repo: {}", e).to_string())
            ),
        )
    };
    result
}
#[get("/fetch-repo/<repo_path..>")]
async fn fetch_repo(state: &State<AppSettings>, repo_path: PathBuf) -> status::Custom<(ContentType, String)> {
    if !NET_IS_ENABLED.load(Ordering::Relaxed) {
        return status::Custom(
            Status::Unauthorized,
            (
                ContentType::JSON,
                make_bad_json_data_response("offline mode".to_string())
            ),
        );
    }
    let mut path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) {
        let source = path_components.next().unwrap().as_os_str().to_str().unwrap();
        let org = path_components.next().unwrap().as_os_str().to_str().unwrap();
        let mut repo = path_components.next().unwrap().as_os_str().to_str().unwrap().to_string();
        if repo.ends_with(".git") {
            let repo_vec = repo.split(".").collect::<Vec<&str>>();
            let short_repo = &repo_vec[0..repo_vec.len() - 1];
            let short_repo_string = short_repo.join("/");
            repo = short_repo_string.as_str().to_owned();
        }
        let url = "https://".to_string() + &repo_path.display().to_string().replace("\\", "/");
        match Repository::clone(
            &url,
            state.repo_dir.clone() +
                os_slash_str() +
                source +
                os_slash_str() +
                org +
                os_slash_str() +
                repo.as_str(),
        ) {
            Ok(_repo) => status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    make_good_json_data_response("ok".to_string())
                ),
            ),
            Err(e) => {
                println!("Error:{}", e);
                return status::Custom(
                    Status::BadRequest,
                    (
                        ContentType::JSON,
                        make_bad_json_data_response(format!("could not clone repo: {}", e).to_string())
                    ),
                );
            }
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

#[get("/delete-repo/<repo_path..>")]
async fn delete_repo(state: &State<AppSettings>, repo_path: PathBuf) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) {
        let path_to_delete = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string();
        match fs::remove_dir_all(path_to_delete) {
            Ok(_) => status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    make_good_json_data_response("ok".to_string())
                ),
            ),
            Err(e) => status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not delete repo: {}", e).to_string())
                ),
            )
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

// METADATA OPERATIONS
#[get("/metadata/raw/<repo_path..>")]
async fn raw_metadata(state: &State<AppSettings>, repo_path: PathBuf) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) {
        let path_to_serve = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/metadata.json";
        match fs::read_to_string(path_to_serve) {
            Ok(v) => status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    v
                ),
            ),
            Err(e) => status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not read metadata: {}", e).to_string())
                ),
            )
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

#[derive(Serialize, Deserialize)]
struct MetadataSummary {
    name: String,
    description: String,
    flavor_type: String,
    flavor: String,
    language_code: String,
    script_direction: String,
}

#[get("/metadata/summary/<repo_path..>")]
async fn summary_metadata(state: &State<AppSettings>, repo_path: PathBuf) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) {
        let path_to_serve = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/metadata.json";
        let file_string = match fs::read_to_string(path_to_serve) {
            Ok(v) => v,
            Err(e) => return status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not read metadata: {}", e).to_string())
                ),
            )
        };
        let raw_metadata_struct: serde_json::Value = match serde_json::from_str(file_string.as_str()) {
            Ok(v) => v,
            Err(e) => return status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not parse metadata: {}", e).to_string())
                ),
            )
        };
        let summary = MetadataSummary {
            name: raw_metadata_struct["identification"]["name"]["en"].as_str().unwrap().to_string(),
            description: match raw_metadata_struct["identification"]["description"]["en"].clone() {
                serde_json::Value::String(v) => v.as_str().to_string(),
                serde_json::Value::Null => "".to_string(),
                _ => "?".to_string()
            },
            flavor_type: raw_metadata_struct["type"]["flavorType"]["name"].as_str().unwrap().to_string(),
            flavor: raw_metadata_struct["type"]["flavorType"]["flavor"]["name"].as_str().unwrap().to_string(),
            language_code: raw_metadata_struct["languages"][0]["tag"].as_str().unwrap().to_string(),
            script_direction: match raw_metadata_struct["languages"][0]["scriptDirection"].clone() {
                serde_json::Value::String(v) => v.as_str().to_string(),
                _ => "?".to_string()
            },
        };
        match serde_json::to_string(&summary) {
            Ok(v) => status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    v
                ),
            ),
            Err(e) => status::Custom(
                Status::InternalServerError,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not serialize metadata: {}", e).to_string())
                ),
            )
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path!".to_string())
            ),
        )
    }
}

// INGREDIENT OPERATIONS

#[get("/ingredient/raw/<repo_path..>?<ipath>")]
async fn raw_ingredient(state: &State<AppSettings>, repo_path: PathBuf, ipath: String) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) && check_path_string_components(ipath.clone()) {
        let path_to_serve = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/ingredients/" + ipath.as_str();
        match fs::read_to_string(path_to_serve) {
            Ok(v) => {
                let mut split_ipath = ipath.split(".").clone();
                let mut suffix = "unknown";
                if let Some(_) = split_ipath.next() {
                    if let Some(second) = split_ipath.next() {
                        suffix = second;
                    }
                }
                status::Custom(
                    Status::Ok,
                    (
                        match mime_types().get(suffix) {
                            Some(t) => t.clone(),
                            None => ContentType::new("application", "octet-stream")
                        },
                        v
                    ),
                )
            }
            Err(e) => status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not read ingredient content: {}", e).to_string())
                ),
            )
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

#[get("/ingredient/as-usj/<repo_path..>?<ipath>")]
async fn get_ingredient_as_usj(state: &State<AppSettings>, repo_path: PathBuf, ipath: String) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) && check_path_string_components(ipath.clone()) {
        let path_to_serve = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/ingredients/" + ipath.as_str();
        match fs::read_to_string(path_to_serve) {
            Ok(v) => status::Custom(
                Status::Ok,
                (
                    ContentType::JSON,
                    transform(v, "usfm".to_string(), "usj".to_string())
                ),
            ),
            Err(e) => status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not read ingredient content: {}", e).to_string())
                ),
            )
        }
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}
#[derive(FromForm)]
struct Upload<'f> {
    file: TempFile<'f>,
}

#[post("/ingredient/as-usj/<repo_path..>?<ipath>", format = "multipart/form-data", data = "<form>")]
async fn post_ingredient_as_usj(state: &State<AppSettings>, repo_path: PathBuf, ipath: String, mut form: Form<Upload<'_>>) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    let destination = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/ingredients/" + ipath.clone().as_str();
    if check_path_components(&mut path_components.clone()) && check_path_string_components(ipath) && fs::metadata(destination.clone()).is_ok() {
        let _ = form.file.persist_to(destination).await;
        status::Custom(
            Status::Ok,
            (
                ContentType::JSON,
                make_good_json_data_response("ok".to_string())
            ),
        )
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

#[get("/ingredient/prettified/<repo_path..>?<ipath>")]
async fn get_ingredient_prettified(state: &State<AppSettings>, repo_path: PathBuf, ipath: String) -> status::Custom<(ContentType, String)> {
    let path_components: Components<'_> = repo_path.components();
    if check_path_components(&mut path_components.clone()) && check_path_string_components(ipath.clone()) {
        let path_to_serve = state.repo_dir.clone() + os_slash_str() + &repo_path.display().to_string() + "/ingredients/" + ipath.as_str();
        let file_string = match fs::read_to_string(path_to_serve) {
            Ok(v) =>
                v,
            Err(e) => return status::Custom(
                Status::BadRequest,
                (
                    ContentType::JSON,
                    make_bad_json_data_response(format!("could not read ingredient content: {}", e).to_string())
                ),
            )
        };
        status::Custom(
            Status::Ok,
            (
                ContentType::HTML,
                format!(
                    r#"
                <html>
                <head>
                <title>Prettified</title>
                <link rel="stylesheet" href="/webfonts/awami.css">
                </head>
                <body>
                <pre class="awami">
                {}
                </pre>
                </body>
                </html>
                "#,
                    file_string
                )
            ),
        )
    } else {
        status::Custom(
            Status::BadRequest,
            (
                ContentType::JSON,
                make_bad_json_data_response("bad repo path".to_string())
            ),
        )
    }
}

#[get("/client/index.html")]
async fn serve_client_index() -> Option<NamedFile> {
    let index_path = Path::new(REACT_STATIC_PATH).join("index.html");
    NamedFile::open(index_path).await.ok()
}

#[get("/client")]
async fn serve_client_dir() -> Redirect {
    Redirect::to(uri!(serve_client_index))
}

#[get("/favicon.ico")]
async fn serve_root_favicon() -> Option<NamedFile> {
    let icon_path = Path::new(REACT_STATIC_PATH)
        .join("favicon.ico");
    NamedFile::open(icon_path).await.ok()
}

#[get("/")]
fn redirect_root() -> Redirect {
    Redirect::to(uri!(serve_client_index))
}

// ERROR HANDLING

#[catch(404)]
fn not_found_catcher(req: &Request<'_>) -> status::Custom<(ContentType, String)> {
    status::Custom(
        Status::NotFound,
        (
            ContentType::JSON,
            make_bad_json_data_response(format!("Resource {} was not found", req.uri())).to_string()
        ),
    )
}

#[catch(default)]
fn default_catcher(req: &Request<'_>) -> status::Custom<(ContentType, String)> {
    status::Custom(
        Status::InternalServerError,
        (
            ContentType::JSON,
            make_bad_json_data_response(format!("unknown error while serving {}", req.uri())).to_string()
        ),
    )
}

// BUILD SERVER

#[rocket::launch]
fn rocket() -> _ {
    // Get settings path, default to well-known homedir location
    let root_path = home_dir_string() + os_slash_str();
    let mut settings_path = root_path.clone() + "pithekos_settings.json";
    let args: Vec<String> = env::args().collect();
    if args.len() == 2 {
        // Do not auto-make at non-default location.
        settings_path = args[1].clone();
    } else {
        // Well-known location. If file doesn't exist make one.
        let settings_file_exists = Path::new(&settings_path).is_file();
        if !settings_file_exists {
            let default_settings = json!({
                "repo_dir": root_path.clone() + "pithekos_repos",
                "resources_dir": root_path.clone() + "pithekos_resources",
                "client_dir": relative!("../client/build"),
                "languages": ["en"]
            });
            let mut file_handle = match fs::File::create(&settings_path) {
                Ok(h) => h,
                Err(e) => {
                    println!("Could not open settings file '{}' to write default: {}", settings_path, e);
                    exit(1);
                }
            };
            match file_handle.write_all(&default_settings.to_string().as_bytes()) {
                Ok(_) => {}
                Err(e) => {
                    println!("Could not write default settings file to '{}: {}' to write default", settings_path, e);
                    exit(1);
                }
            }
        }
    }
    // Try to load settings JSON
    let settings_json_string = match fs::read_to_string(&settings_path) {
        Ok(s) => s,
        Err(e) => {
            println!("Could not read settings file '{}': {}", settings_path, e);
            exit(1);
        }
    };
    let settings_json: Value = match serde_json::from_str(settings_json_string.as_str()) {
        Ok(j) => j,
        Err(e) => {
            println!("Could not parse settings file '{}': {}", settings_path, e);
            exit(1);
        }
    };
    // Find or make repo_dir
    let repo_dir_path = settings_json["repo_dir"].as_str().unwrap().to_string();
    let repo_dir_path_exists = Path::new(&repo_dir_path).is_dir();
    if !repo_dir_path_exists {
        match fs::create_dir_all(&repo_dir_path) {
            Ok(_) => {}
            Err(e) => {
                println!("Could not create repo dir '{}': {}", repo_dir_path, e);
                exit(1);
            }
        };
    }
    // Find or make resources_dir
    let resources_dir_path = settings_json["resources_dir"].as_str().unwrap().to_string();
    let resources_dir_path_exists = Path::new(&resources_dir_path).is_dir();
    if !resources_dir_path_exists {
        match fs::create_dir_all(&resources_dir_path) {
            Ok(_) => {}
            Err(e) => {
                println!("Could not create resources dir '{}': {}", resources_dir_path, e);
                exit(1);
            }
        };
    }
    // Copy web fonts
    let template_webfonts_dir_path = relative!("./webfonts").to_string();
    let webfonts_dir_path = resources_dir_path.clone() + os_slash_str() + "webfonts";
    if !Path::new(&webfonts_dir_path).is_dir() {
        match copy_dir(template_webfonts_dir_path.clone(), webfonts_dir_path.clone()) {
            Ok(_) => {}
            Err(e) => {
                println!(
                    "Could not copy web fonts to resources directory: {}",
                    e
                );
                exit(1);
            }
        }
    };
    // Copy templates to resources_dir if not present
    let template_dir_path = relative!("./templates").to_string();
    let template_dir_entries = std::fs::read_dir(template_dir_path.clone()).unwrap();
    for entry in template_dir_entries {
        let leaf_name = entry.unwrap().file_name().into_string().unwrap();
        let resource_leaf_path = resources_dir_path.clone() + os_slash_str() + leaf_name.as_str();
        if !Path::new(&resource_leaf_path).is_dir() && !Path::new(&resource_leaf_path).is_file() {
            let template_leaf_path = template_dir_path.clone() + os_slash_str() + leaf_name.as_str();
            match copy_dir(template_leaf_path, resource_leaf_path) {
                Ok(_) => {}
                Err(e) => {
                    println!(
                        "Could not copy {} to resources directory: {}",
                        leaf_name.as_str(),
                        e
                    );
                    exit(1);
                }
            };
        }
    }
    // Require client_dir
    let client_dir_path = settings_json["client_dir"].as_str().unwrap().to_string();
    let client_dir_path_exists = Path::new(&client_dir_path).is_dir();
    if !client_dir_path_exists {
        println!("Could not find  client directory '{}'", client_dir_path);
        exit(1);
    }

    rocket::build()
        .register("/", catchers![
            not_found_catcher,
            default_catcher
        ])
        .mount("/webfonts", FileServer::from(webfonts_dir_path.clone()))
        .mount("/client", FileServer::from(client_dir_path.clone()))
        .manage(
            AppSettings {
                client_dir: client_dir_path.clone(),
                repo_dir: repo_dir_path.clone(),
                resources_dir: resources_dir_path.clone(),
                languages: settings_json["languages"]
                    .as_array()
                    .unwrap()
                    .into_iter()
                    .map(|i| { i.as_str().expect("Non-string in settings language array").to_string() })
                    .collect(),
            }
        )
        .mount("/", routes![
            redirect_root,
            serve_client_index,
            serve_client_dir,
            serve_root_favicon
        ])
        .mount("/settings", routes![
            get_languages,
        ])
        .mount("/net", routes![
            net_status,
            net_enable,
            net_disable
        ])
        .mount("/i18n", routes![
            raw_i18n,
            negotiated_i18n,
            flat_i18n
        ])
        .mount("/git", routes![
            fetch_repo,
            list_local_repos,
            delete_repo,
            add_and_commit,
        ])
        .mount("/burrito", routes![
            raw_ingredient,
            get_ingredient_prettified,
            get_ingredient_as_usj,
            post_ingredient_as_usj,
            raw_metadata,
            summary_metadata
        ])
}
