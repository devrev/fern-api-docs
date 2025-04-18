import os
import re
import requests

def get_response(prompt):

    auth = os.environ.get('LLM_TOKEN')
    if auth:
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {auth}"}
        payload = {
            "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
            "temperature": 0,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        try:
            r = requests.post('https://openwebui.dev.devrev-eng.ai/api/chat/completions', json=payload,
                                headers=headers)
            response = r.json()['choices'][0]['message']['content']
            response = re.sub(r"^# .*\n?", '', response, flags=re.MULTILINE)
            return response
        except Exception as e:
            print(f"Failed to generate changelog. Error: {type(e)} {e} {r}")
            return None
        
def get_lines_between_tags(text, tag):
  pattern = r'<' + tag + r'>(.*?)<\/' + tag + r'>'
  matches = re.findall(pattern, text, re.DOTALL)
  return "".join([match.strip() for match in matches])

def get_lines_before_tag(text, tag):
  pattern = r'(.*?)<' + tag + r'>'
  matches = re.findall(pattern, text, re.DOTALL)
  return "".join([match.strip() for match in matches])