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
            r.raise_for_status()

            if not r.text:
                raise ValueError("Empty response received from API")
            json_response = r.json()
            if not json_response.get('choices'):
                raise ValueError("No 'choices' field in response")
            if not json_response['choices'][0].get('message'):
                raise ValueError("No 'message' field in response")
            if not json_response['choices'][0]['message'].get('content'):
                raise ValueError("No 'content' field in response")
            
            response = json_response['choices'][0]['message']['content']
            
            # Check if final response is empty
            if not response:
                raise ValueError("Empty content received from API")
                
            return response

        except requests.RequestException as e:
            print(f"HTTP request failed. Error: {type(e)} {e}")
            return None
        except ValueError as e:
            print(f"Invalid response received. Error: {e}")
            return None
        except Exception as e:
            print(f"Failed to generate response. Error: {type(e)} {e}")
            return None
        
def get_lines_between_tags(text, tag):
  pattern = r'<' + tag + r'>(.*?)<\/' + tag + r'>'
  matches = re.findall(pattern, text, re.DOTALL)
  return "".join([match.strip() for match in matches])

def get_lines_before_tag(text, tag):
  pattern = r'(.*?)<' + tag + r'>'
  matches = re.findall(pattern, text, re.DOTALL)
  return "".join([match.strip() for match in matches])