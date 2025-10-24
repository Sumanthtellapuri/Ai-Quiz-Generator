import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from models import QuizOutput

def get_gemini_api_key():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    return api_key

def generate_quiz(article_title: str, article_content: str):
    try:
        api_key = get_gemini_api_key()
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=api_key,
            temperature=0.7
        )
        
        parser = JsonOutputParser(pydantic_object=QuizOutput)
        
        prompt_template = PromptTemplate(
            template="""You are an expert educational content creator. Based on the following Wikipedia article, generate an engaging and educational quiz.

Article Title: {title}

Article Content:
{content}

Your task is to create a comprehensive quiz with the following structure:

1. A brief summary of the article (2-3 sentences)
2. Generate 7-10 multiple-choice questions that:
   - Cover different aspects of the article
   - Range from basic recall to deeper understanding
   - Have 4 options each with only ONE correct answer
   - Include clear explanations for the correct answers
3. Identify 3-5 key entities or concepts from the article
4. Suggest 3-5 related topics for further reading

{format_instructions}

Ensure the quiz is educational, engaging, and accurately reflects the article content.""",
            input_variables=["title", "content"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        chain = prompt_template | llm | parser
        
        result = chain.invoke({
            "title": article_title,
            "content": article_content
        })
        
        return result
    
    except Exception as e:
        raise Exception(f"Error generating quiz with LLM: {str(e)}")
