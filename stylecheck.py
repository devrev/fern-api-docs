import argparse
import os
import pathlib
import llm_client

def main(args):
    print(f"Checking style for {args.doc}")
    with open(args.doc, 'r', encoding="utf-8") as infile:
        content = infile.read()
    
    style = 'stylecheck/style-common.md'
    with open(style, 'r', encoding="utf-8") as infile:
        style = infile.read()

    prompt = gen_prompt(content, style)
    prompt_file = f"temp/prompt.md"
    with open(prompt_file, 'w', encoding="utf-8") as outfile:
        outfile.write(prompt)
        print(f"Wrote prompt to {prompt_file}.")

    revised = llm_client.get_response(prompt)

    revision_file = "/".join(['temp', os.path.basename(args.doc)])
    if (revised):
        with open(revision_file, 'w', encoding="utf-8") as outfile:
            outfile.write(revised)
            print(f"Wrote log to {revision_file}.")
    else:
        print(f"Failed to generate {revision_file}.")


def gen_prompt(content, style):
    prompt = 'stylecheck/prompt.md'
    with open(prompt, 'r') as infile:
        prompt = infile.read()
    prompt += "\n\n"
    prompt += style
    prompt += "\n\n<document>\n\n"
    prompt += content
    prompt += "\n\n</document>\n\n"
    return prompt


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check writing style of markdown file")
    parser.add_argument('--doc', type=pathlib.Path, required=True)
    args = parser.parse_args()
    main(args)