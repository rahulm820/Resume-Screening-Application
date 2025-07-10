from flask import Flask, request, jsonify
import spacy
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import TreebankWordTokenizer
from pdfminer.high_level import extract_text

# Download NLTK stopwords
nltk.download('stopwords')

app = Flask(__name__)

nlp = spacy.load("en_core_web_sm")
tokenizer = TreebankWordTokenizer()

def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    tokens = tokenizer.tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    return ' '.join(tokens)

def extract_skills(text):
    predefined_skills = [
        "c", "c++", "java", "python", "html", "css", "javascript", "typescript",
        "node.js", "nodejs", "express.js", "expressjs", "react.js", "reactjs", 
        "angular", "vue.js", "django", "flask", "laravel", "spring boot", 
        "ruby on rails", "php", "golang", "rust", "swift", "kotlin", "dart", 
        "oop", "object oriented programming", "dbms", "os", "data structures", "algorithms",

        "machine learning", "deep learning", "computer vision", "nlp", "data science",
        "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", 
        "keras", "pytorch", "huggingface", "openai", "langchain", "llamaindex",

        "docker", "kubernetes", "jenkins", "gitlab ci", "circleci", "terraform",
        "ansible", "puppet", "chef", "aws", "azure", "gcp", "firebase", 
        "heroku", "netlify", "vercel", "linux",

        "mysql", "mongodb", "postgresql", "sqlite", "mariadb", "redis", 
        "cassandra", "dynamodb", "snowflake", "bigquery", "etl", 
        "data warehousing", "data lake", "airflow",

        "web scraping", "beautifulsoup", "scrapy", "selenium",

        "figma", "adobe xd", "photoshop", "illustrator", "canva",
        "wireframing", "prototyping", "user research", "ux design",

        "android", "ios", "react native", "flutter", "ionic", "swiftui", 
        "jetpack compose",

        "wordpress", "shopify", "magento", "woocommerce", "drupal", "joomla",

        "ms excel", "ms word", "ms powerpoint", "google sheets", "google docs", 
        "notion", "trello", "asana", "jira", "slack", "monday.com", "zapier",

        "penetration testing", "ethical hacking", "kali linux", "burpsuite", 
        "wireshark", "nmap", "metasploit",

        "tcp/ip", "dns", "dhcp", "vpn", "firewalls", "cisco", "ccna",

        "financial modeling", "budgeting", "forecasting", "excel vba", "sap", "quickbooks",

        "seo", "sem", "google ads", "social media marketing", "content marketing", 
        "email marketing", "google analytics",

        "talent acquisition", "payroll", "hrms", "ats", "employee engagement",

        "lesson planning", "curriculum development", "classroom management", "lms",

        "leadership", "communication", "teamwork", "time management", 
        "critical thinking", "problem solving", "adaptability", "conflict resolution"
    ]

    text = text.lower()
    found_skills = [skill for skill in predefined_skills if skill in text]
    return found_skills

def score_experience(resume_experience, job_experience):
    years_of_experience = re.findall(r'\d+', resume_experience)
    resume_exp = int(years_of_experience[0]) if years_of_experience else 0

    job_exp = re.findall(r'\d+', job_experience)
    job_exp = int(job_exp[0]) if job_exp else 0

    exp_score = max(0, min(1, 1 - abs(resume_exp - job_exp) / max(resume_exp, job_exp, 1)))
    print(f"Resume Exp: {resume_exp}, Job Exp: {job_exp}, Score: {exp_score}")
    return exp_score

def calculate_text_similarity(resume_text, jd_text):
    resume_text = preprocess_text(resume_text)
    jd_text = preprocess_text(jd_text)

    print("\n--- Preprocessed Resume ---\n", resume_text)
    print("\n--- Preprocessed JD ---\n", jd_text)

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    similarity = (tfidf_matrix * tfidf_matrix.T).A[0, 1]
    print(f"Similarity Score: {similarity}")
    return similarity

def extract_text_from_pdf(pdf_path):
    try:
        return extract_text(pdf_path)
    except Exception as e:
        return f"Error extracting text from PDF: {e}"

def score_resume(resume_path, experience, job_description):
    resume_content = ""
    if resume_path.endswith('.pdf'):
        resume_content = extract_text_from_pdf(resume_path)
    else:
        with open(resume_path, 'r') as file:
            resume_content = file.read()

    print(f"\n\n=== Resume Text from {resume_path} ===\n{resume_content[:1000]}")

    resume_skills = extract_skills(resume_content)
    job_skills = extract_skills(job_description)

    print("Resume Skills:", resume_skills)
    print("Job Description Skills:", job_skills)
    print("Matched Skills:", set(resume_skills) & set(job_skills))

    skill_matches = len(set(resume_skills) & set(job_skills))
    skill_score = skill_matches / max(len(job_skills), 1)

    experience_score = score_experience(experience, job_description)
    jd_similarity_score = calculate_text_similarity(resume_content, job_description)

    total_score = (0.3 * skill_score) + (0.4 * experience_score) + (0.3 * jd_similarity_score)
    print(f"Total Score for {resume_path}: {total_score:.4f}")
    return total_score

@app.route('/score_resumes', methods=['POST'])
def score_resumes_api():
    data = request.json
    resume_paths = data.get('resume_paths')
    print(f"Resume Paths: {resume_paths}")
    job_description = data.get('job_description')
    print(f"Job Description: {job_description}")

    if not resume_paths or not job_description:
        return jsonify({'error': 'Missing resume paths or job description'}), 400

    experience = job_description.get('experience', '')
    job_description_text = job_description.get('description', '')

    if not experience or not job_description_text:
        return jsonify({'error': 'Job description or experience is missing'}), 400

    ranked_resumes = []

    for resume_path in resume_paths:
        score = score_resume(resume_path, experience, job_description_text)
        ranked_resumes.append({'resume_path': resume_path, 'score': score})

    ranked_resumes = sorted(ranked_resumes, key=lambda x: x['score'], reverse=True)

    return jsonify({'ranked_resumes': ranked_resumes})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
