import argparse
import os
import pathlib
import llm_client
import difflib
import re
import requests
import json


def create_line_diff(old_file, new_file):
    with open(old_file, 'r', encoding='utf-8') as f1:
        old_lines = f1.readlines()
    with open(new_file, 'r', encoding='utf-8') as f2:
        new_lines = f2.readlines()

    # Get line-level differences
    matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
    
    # Generate unified diff format
    diff_lines = []
    old_file = old_file.replace('\\', '/')
    diff_lines.append(f"--- a/{old_file}")
    diff_lines.append(f"+++ b/{old_file}")
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'replace':
            # Add hunk header
            diff_lines.append(f'@@ -{i1+1},{i2-i1} +{j1+1},{j2-j1} @@')
            # Add removals
            for line in old_lines[i1:i2]:
                diff_lines.append('-' + line.rstrip())
            # Add additions
            for line in new_lines[j1:j2]:
                diff_lines.append('+' + line.rstrip())
            diff_lines.append('')

    return '\n'.join(diff_lines)


def restore_title(old, new):
    with open(old, 'r') as infile:
        old = infile.read()

    old_first = old.splitlines()[0]
    new_first = new.splitlines()[0]
    if old_first.startswith('#') and not new_first.startswith('#'):
        new = old_first + "\n\n" + new

    return new

def gen_prompt(args):

    with open('style/prompt.md', 'r') as infile:
        prompt = infile.read()
    prompt += "\n\n"

    with open('style/style-common.md', 'r', encoding="utf-8") as infile:
        prompt += infile.read()

    if args.style and os.path.exists(args.style):
        with open(args.style, 'r', encoding="utf-8") as infile:
            prompt += "\n\n"
            prompt += infile.read()
            prompt += "\n\n"

    with open('style/term-common.csv', 'r', encoding="utf-8") as infile:
            prompt += "\n\n<terminology>\n"
            prompt += infile.read()
    
    if args.term and os.path.exists(args.term):
        with open(args.style, 'r', encoding="utf-8") as infile:
            prompt += infile.read()
    prompt += "\n</terminology>\n\n"

    prompt += "\n\n<document>\n\n"
    with open(args.doc, 'r', encoding="utf-8") as infile:
        prompt += infile.read()
    prompt += "\n\n</document>\n\n"

    return prompt


def parse_diff_hunks(diff_text):
    path = diff_text.split('\n')[0].split('a/')[1]
    print(f"Constructing comments for {path}.")
    hunks = diff_text.split('@@ ')
    comments = []
    
    for hunk in hunks[1:]:
        header_match = re.match(r'^-(\d+),(\d+) \+(\d+),(\d+) @@', hunk)
        if not header_match:
            continue
            
        old_start, old_lines, new_start, new_lines = map(int, header_match.groups())
        lines = hunk.split('\n')[1:]  # Skip header line
        
        i = 0
        while i < len(lines):
            # Collect consecutive removed lines
            removed_lines = []
            while i < len(lines) and lines[i].startswith('-'):
                removed_lines.append(lines[i][1:])
                i += 1
            
            # Collect consecutive added lines
            added_lines = []
            while i < len(lines) and lines[i].startswith('+'):
                added_lines.append(lines[i][1:])
                i += 1
            
            # If we have both removed and added lines, create a suggestion
            if removed_lines and added_lines:
                added_lines = "\n".join(added_lines)
                comment = {
                    'path': path,
                    'line': old_start + old_lines - 1,
                    'side': 'RIGHT',
                    'body': f'```suggestion\n{added_lines}\n```'
                }
                if old_start < comment['line']:
                    comment['start_line'] = old_start
                comments.append(comment)
            
            # Skip context lines
            while i < len(lines) and not (lines[i].startswith('-') or lines[i].startswith('+')):
                i += 1
                
    return comments

def post_review_comment(owner, repo, pr_number, comment):
    comment['commit_id'] = os.environ.get('COMMIT')

    url = f'https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}/comments'
    headers = {
        'Authorization': f"token {os.environ.get('STYLECHECK')}",
        'Accept': 'application/vnd.github.v3+json'
    }
    try:
        response = requests.post(url, headers=headers, json=comment)
        response.raise_for_status()
        print(f"Posted comment on line {comment['line']}.")
    except Exception as e:
        print(
            f"Failed to post comment. Error: {type(e)} {e}")
 
def my_writer(data, file, note=None):
    if (data):
        with open(file, 'w', encoding="utf-8") as outfile:
            if type(data) is str:
                outfile.write(data)
            else:
                json.dump(data, outfile, indent=4)
            print(' '.join(['Wrote', note, 'to', file]))
    else:
        print(f"Failed to write {file}.")

def main(args):
    print(f"Checking style for {args.doc}")
    doc_name, ext = os.path.splitext(os.path.basename(args.doc))

    prompt = gen_prompt(args)
    my_writer(prompt, f"temp/{doc_name}_prompt.md", 'prompt')
    response_file = f"temp/{doc_name}_response.md"
    if args.llm:
        response = llm_client.get_response(prompt)
        my_writer(response, response_file, 'response')
    else:
        try:
            with open(response_file, 'r') as infile:
                response = infile.read()
            print(f"Reading response from {response_file}.")
        except:
            print(f"LLM response in {response_file} not found. Exiting.")
            return
    comment = llm_client.get_lines_before_tag(response, 'document')
    revision = llm_client.get_lines_between_tags(response, 'document')
    revision = restore_title(args.doc, revision)
    revision_file = f"temp/{doc_name}_revision{ext}"
    my_writer(revision, revision_file, 'revision')
    diff = create_line_diff(args.doc, revision_file)
    my_writer(diff, f"temp/{doc_name}.diff", 'diff')

    suggestions = parse_diff_hunks(diff)
    my_writer(suggestions, f"temp/{doc_name}_suggestions.json", 'suggestions')
    if (args.suggest):
        for suggestion in suggestions:
            post_review_comment(os.environ.get('OWNER'), os.environ.get('REPO'), os.environ.get('PR'), suggestion)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check writing style of markdown file")
    parser.add_argument('--style', type=pathlib.Path)
    parser.add_argument('--term', type=pathlib.Path)
    parser.add_argument('--llm', default=True, action=argparse.BooleanOptionalAction)
    parser.add_argument('--suggest', default=True, action=argparse.BooleanOptionalAction)
    parser.add_argument('doc', nargs=1, type=pathlib.Path)

    args = parser.parse_args()
    args.doc = str(args.doc[0])

    main(args)