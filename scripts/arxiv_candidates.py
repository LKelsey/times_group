#!/usr/bin/env python3
"""List recent arXiv papers by group members that aren't in data/papers.js yet.

Prints ready-to-paste entries for data/papers.js. Check each one is in scope
(see research.html) and add tags before pasting. Uses only the standard library.

    python3 scripts/arxiv_candidates.py                 # PIs + members, last 10 papers each
    python3 scripts/arxiv_candidates.py --max 25
    python3 scripts/arxiv_candidates.py --author "Jane Doe"
"""
import argparse
import json
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATOM = "{http://www.w3.org/2005/Atom}"
MAX_AUTHORS = 50  # skip large-collaboration papers


def member_names():
    text = (ROOT / "data" / "members.js").read_text()
    # Drop comments so the template entry isn't picked up.
    text = re.sub(r"//.*", "", text)
    return re.findall(r'name:\s*"([^"]+)"', text)


def known_ids():
    return set(re.findall(r'arxiv:\s*"([^"]+)"', (ROOT / "data" / "papers.js").read_text()))


def short_name(full):
    parts = full.split()
    # Surname starts at the last word, or earlier at a particle like "van" / "de".
    cut = len(parts) - 1
    while cut > 1 and parts[cut - 1][0].islower():
        cut -= 1
    initials = " ".join(p[0] + "." for p in parts[:cut])
    return f"{initials} {' '.join(parts[cut:])}".strip()


def query(author, n):
    q = urllib.parse.urlencode({
        "search_query": f'au:"{author}"',
        "sortBy": "submittedDate",
        "sortOrder": "descending",
        "max_results": n,
    })
    with urllib.request.urlopen(f"https://export.arxiv.org/api/query?{q}") as r:
        root = ET.fromstring(r.read())
    for e in root.iter(f"{ATOM}entry"):
        arxiv_id = e.find(f"{ATOM}id").text.rsplit("/", 1)[-1].split("v")[0]
        authors = [a.find(f"{ATOM}name").text for a in e.findall(f"{ATOM}author")]
        yield {
            "arxiv": arxiv_id,
            "date": e.find(f"{ATOM}published").text[:7],
            "title": " ".join(e.find(f"{ATOM}title").text.split()),
            "authors": authors,
        }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--author", action="append", help="author to search (default: everyone in data/members.js)")
    ap.add_argument("--max", type=int, default=10, help="papers to fetch per author")
    args = ap.parse_args()

    seen = known_ids()
    for author in args.author or member_names():
        for p in query(author, args.max):
            if p["arxiv"] in seen or len(p["authors"]) > MAX_AUTHORS:
                continue
            seen.add(p["arxiv"])
            names = [short_name(a) for a in p["authors"]]
            authors = ", ".join(names) if len(names) <= 7 else ", ".join(names[:4]) + ", et al."
            print(f'  {{ arxiv: "{p["arxiv"]}", date: "{p["date"]}", tags: [],\n'
                  f'    title: {json.dumps(p["title"], ensure_ascii=False)},\n'
                  f'    authors: {json.dumps(authors, ensure_ascii=False)} }},')
        time.sleep(3)  # arXiv asks for a pause between API calls


if __name__ == "__main__":
    main()
