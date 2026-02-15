export interface Contact {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    linkedinUrl: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    highlights: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    period: string;
}

export interface Language {
    language: string;
    proficiency: string;
}

export interface Publication {
    title: string;
    url: string;
}

export interface ResumeData {
    id?: string;
    resumeTitle?: string;
    name: string;

    title: string;
    summary: string;
    contact: Contact;
    experience: Experience[];
    education: Education[];
    skills: Record<string, string[]>;
    languages: Language[];
    certifications: string[];
    publications: Publication[];
    updatedAt?: string;
}

export interface ResumeManifest {
    resumes: {
        id: string;
        name: string;
        lastModified: string;
    }[];
    currentResumeId: string;
}
