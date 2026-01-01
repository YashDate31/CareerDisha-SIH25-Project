import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerdisha_backend.settings')
django.setup()

from resources.models import Scholarship, College
from datetime import datetime, date, timedelta

# Create 10 Real Scholarships
scholarships_data = [
    {
        "title": "Kishore Vaigyanik Protsahan Yojana (KVPY) Fellowship",
        "description": "A national fellowship program by Department of Science and Technology to encourage students to take up research career in science. The fellowship is available for students studying Basic Sciences, Engineering and Medicine.",
        "amount": 80000.00,
        "eligibility_criteria": "Students in 11th, 12th standard and 1st year of undergraduate in Basic Sciences/Engineering/Medicine",
        "application_deadline": date(2025, 5, 15),
        "scholarship_type": "merit",
        "education_level": "undergraduate",
        "field_of_study": "Science, Engineering, Medicine",
        "provider_name": "Department of Science & Technology, Govt of India",
        "provider_website": "http://kvpy.iisc.ernet.in/",
        "application_link": "http://kvpy.iisc.ernet.in/main/applications.htm"
    },
    {
        "title": "National Talent Search Examination (NTSE) Scholarship",
        "description": "A national level scholarship program to identify and recognize students with high intellect and academic talent. Provides monthly stipend throughout academic career.",
        "amount": 150000.00,
        "eligibility_criteria": "Students in Class X from recognized schools",
        "application_deadline": date(2025, 3, 30),
        "scholarship_type": "merit",
        "education_level": "all_levels",
        "field_of_study": "All subjects",
        "provider_name": "National Council of Educational Research and Training (NCERT)",
        "provider_website": "https://ncert.nic.in/",
        "application_link": "https://ncert.nic.in/national-talent-search-ntse.php"
    },
    {
        "title": "Prime Ministers Special Scholarship Scheme (PMSSS)",
        "description": "Special scholarship for students of Jammu & Kashmir and Ladakh to pursue undergraduate courses in various fields across India.",
        "amount": 125000.00,
        "eligibility_criteria": "Students from J&K and Ladakh who have passed 12th standard",
        "application_deadline": date(2025, 4, 20),
        "scholarship_type": "government",
        "education_level": "undergraduate", 
        "field_of_study": "Engineering, Medical, Management, etc",
        "provider_name": "Ministry of Human Resource Development",
        "provider_website": "https://www.aicte-india.org/",
        "application_link": "https://www.aicte-india.org/bureaus/pmsss"
    },
    {
        "title": "Indian Oil Academic Scholarships",
        "description": "Merit-cum-means scholarship for economically weaker students pursuing professional courses in Engineering and Medicine.",
        "amount": 200000.00,
        "eligibility_criteria": "Students in Engineering/Medicine from economically weaker sections",
        "application_deadline": date(2025, 6, 10), 
        "scholarship_type": "need",
        "education_level": "undergraduate",
        "field_of_study": "Engineering, Medicine",
        "provider_name": "Indian Oil Corporation Limited",
        "provider_website": "https://iocl.com/",
        "application_link": "https://iocl.com/AboutUs/scholaship.aspx"
    },
    {
        "title": "Reliance Foundation Undergraduate Scholarship",
        "description": "Scholarship program for meritorious students from economically disadvantaged backgrounds to pursue undergraduate studies.",
        "amount": 200000.00,
        "eligibility_criteria": "Class 12 passed students with family income less than Rs 6 lakh per annum",
        "application_deadline": date(2025, 7, 31),
        "scholarship_type": "need",
        "education_level": "undergraduate",
        "field_of_study": "All subjects",
        "provider_name": "Reliance Foundation",
        "provider_website": "https://reliancefoundation.org/",
        "application_link": "https://reliancefoundation.org/education/scholarships-and-fellowships"
    },
    {
        "title": "Tata Scholarship for Indian Students at Cornell University",
        "description": "Scholarship for Indian students to pursue undergraduate studies at Cornell University, USA.",
        "amount": 2500000.00,
        "eligibility_criteria": "Indian students admitted to Cornell University with exceptional academic record",
        "application_deadline": date(2025, 2, 15),
        "scholarship_type": "merit",
        "education_level": "undergraduate",
        "field_of_study": "All subjects",
        "provider_name": "Tata Education and Development Trust",
        "provider_website": "https://www.tatatrusts.org/",
        "application_link": "https://www.cornell.edu/search/index.cfm?q=tata+scholarship"
    },
    {
        "title": "INSPIRE Scholarship for Higher Education",
        "description": "Scholarship to attract talented students to pursue natural and basic sciences in higher education and ensure the country has adequate science human resources.",
        "amount": 80000.00,
        "eligibility_criteria": "Students securing top 1% marks in 12th standard in science subjects",
        "application_deadline": date(2025, 8, 15),
        "scholarship_type": "merit",
        "education_level": "undergraduate",
        "field_of_study": "Natural and Basic Sciences",
        "provider_name": "Department of Science and Technology",
        "provider_website": "http://www.inspire-dst.gov.in/",
        "application_link": "http://www.inspire-dst.gov.in/she.html"
    },
    {
        "title": "Sitaram Jindal Foundation Scholarship",
        "description": "Scholarship for meritorious students from economically weaker sections to pursue higher education.",
        "amount": 100000.00,
        "eligibility_criteria": "Students with family income less than Rs 2.5 lakh per annum",
        "application_deadline": date(2025, 9, 30),
        "scholarship_type": "need",
        "education_level": "all_levels",
        "field_of_study": "All subjects",
        "provider_name": "Sitaram Jindal Foundation",
        "provider_website": "https://www.sitaramjindalfoundation.org/",
        "application_link": "https://www.sitaramjindalfoundation.org/scholarship.php"
    },
    {
        "title": "Aditya Birla Scholarship Programme",
        "description": "Scholarship for students pursuing engineering from premier institutes like IITs and NITs.",
        "amount": 150000.00,
        "eligibility_criteria": "Students in 1st year of Engineering in IITs/NITs/BITS",
        "application_deadline": date(2025, 5, 31),
        "scholarship_type": "merit",
        "education_level": "undergraduate",
        "field_of_study": "Engineering",
        "provider_name": "Aditya Birla Group",
        "provider_website": "https://www.adityabirla.com/",
        "application_link": "https://www.adityabirla.com/sustainability/birla-education-trust"
    },
    {
        "title": "Dr. A.P.J. Abdul Kalam IGNITE Awards",
        "description": "Awards to promote creativity and innovation among students and encourage them to take up challenges.",
        "amount": 50000.00,
        "eligibility_criteria": "Students up to Class XII with innovative ideas and projects",
        "application_deadline": date(2025, 4, 15),
        "scholarship_type": "merit",
        "education_level": "all_levels", 
        "field_of_study": "Science, Technology, Innovation",
        "provider_name": "National Innovation Foundation",
        "provider_website": "http://www.nif.org.in/",
        "application_link": "http://www.nif.org.in/ignite"
    }
]

# Create scholarships
for scholarship_data in scholarships_data:
    scholarship = Scholarship.objects.create(**scholarship_data)
    print(f"Created scholarship: {scholarship.title}")

print(f"Created {len(scholarships_data)} scholarships successfully!")