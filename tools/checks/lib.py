from pathlib import Path

SKIP_DIR_NAMES = {".git", ".cursor", "tools", "plans"}


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def iter_html_files(root: Path):
    for path in root.rglob("*.html"):
        rel_parts = path.relative_to(root).parts
        if any(part in SKIP_DIR_NAMES for part in rel_parts):
            continue
        yield path


def write_report(path: Path, title: str, findings: list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["# " + title, "", "Severity: **Blocker** | **Review** | **Nit**", ""]
    if not findings:
        lines.append("No findings.")
        lines.append("")
    else:
        by = {"Blocker": [], "Review": [], "Nit": []}
        for item in findings:
            by.get(item["severity"], by["Review"]).append(item)
        for sev in ("Blocker", "Review", "Nit"):
            if not by[sev]:
                continue
            lines.append("## " + sev)
            lines.append("")
            for item in by[sev]:
                loc = item.get("file", "")
                lines.append("- **%s** — %s" % (loc, item["message"]))
            lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")
