import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title_element = soup.find('h1', class_='firstHeading') or soup.find('h1')
        title = title_element.get_text().strip() if title_element else "Unknown Title"
        
        content_div = soup.find('div', id='mw-content-text')
        
        if not content_div:
            raise ValueError("Could not find main content in the Wikipedia article")
        
        for element in content_div.find_all(['sup', 'table', 'style', 'script']):
            element.decompose()
        
        paragraphs = content_div.find_all('p')
        
        clean_text = []
        for p in paragraphs:
            text = p.get_text().strip()
            if text and len(text) > 50:
                clean_text.append(text)
        
        content = '\n\n'.join(clean_text[:30])
        
        if len(content) < 200:
            raise ValueError("Extracted content is too short. This may not be a valid Wikipedia article.")
        
        return {
            "title": title,
            "content": content
        }
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error fetching Wikipedia URL: {str(e)}")
    except Exception as e:
        raise Exception(f"Error scraping Wikipedia: {str(e)}")
