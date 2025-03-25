import argparse
import os
import pathlib
import llm_client
import difflib

def create_line_diff(old_file, new_file):
    with open(old_file, 'r', encoding='utf-8') as f1:
        old_lines = f1.readlines()
    with open(new_file, 'r', encoding='utf-8') as f2:
        new_lines = f2.readlines()

    # Get line-level differences
    matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
    
    # Generate unified diff format
    diff_lines = []
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
            diff_lines.append('')  # blank line between hunks

    return '\n'.join(diff_lines)

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

def my_writer(content, file, note=None):
    if (content):
        with open(file, 'w', encoding="utf-8") as outfile:
            outfile.write(content)
            print(' '.join(['Wrote', note, 'to', file]))
    else:
        print(f"Failed to write {file}.")

def main(args):
    print(f"Checking style for {args.doc}")
    doc_name, ext = os.path.splitext(os.path.basename(args.doc))

    prompt = gen_prompt(args)
    my_writer(prompt, f"temp/{doc_name}_prompt.md", 'prompt')
    response = llm_client.get_response(prompt)
    my_writer(response, f"temp/{doc_name}_response.md", 'response')
    revision = llm_client.get_lines_between_tags(response, 'document')
    revision_file = f"temp/{doc_name}_revision{ext}"
    my_writer(revision, revision_file, 'revision')
    diff = create_line_diff(args.doc, revision_file)
    my_writer(diff, f"temp/{doc_name}.diff", 'diff')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check writing style of markdown file")
    parser.add_argument('--doc', type=pathlib.Path, required=True)
    parser.add_argument('--style', type=pathlib.Path)
    parser.add_argument('--term', type=pathlib.Path)

    args = parser.parse_args()
    main(args)