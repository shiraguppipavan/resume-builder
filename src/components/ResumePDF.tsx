import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types';

// Register fonts (optional, using standard fonts for stability first)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

// Disable hyphenation globally for the PDF
Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 0,
        fontFamily: 'Helvetica', // Standard font
    },
    container: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    // Header
    header: {
        padding: 50, // Increased from 40
        paddingBottom: 30,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        flexDirection: 'column', // Ensure column direction
    },
    name: {
        fontSize: 30, // Increased from 24
        fontWeight: 'bold',
        fontFamily: 'Times-Roman',
        marginBottom: 12,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        lineHeight: 1.2, // Added line height
    },
    title: {
        fontSize: 12, // Increased from 10
        color: '#D1D5DB',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
        marginTop: 5, // Added top margin for separation
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    contactItem: {
        fontSize: 11, // Increased from 9
        color: '#D1D5DB', // gray-300
        flexDirection: 'row',
        alignItems: 'center',
    },
    link: {
        textDecoration: 'none',
        color: '#D1D5DB', // gray-300
    },
    // Main Layout
    mainLayout: {
        flexDirection: 'row',
        flexGrow: 1,
    },
    // Sidebar (Left)
    sidebar: {
        width: '35%', // Increased from 32%
        backgroundColor: '#FFFFFF',
        padding: 25, // Increased from 15
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    // Main Content (Right)
    mainContent: {
        width: '65%', // Adjusted to match sidebar increase
        padding: 30, // Increased from 20
        paddingRight: 30, // Added padding to the right side
    },
    // Section
    section: {
        marginBottom: 25, // Increased from 15
    },
    sectionTitle: {
        fontSize: 14, // Increased from 10
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12, // Increased from 8
        color: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 6, // Increased from 4
    },
    // Education
    eduItem: {
        marginBottom: 12, // Increased from 8
    },
    eduInst: {
        fontSize: 11, // Increased from 9
        fontWeight: 'bold',
        marginBottom: 2,
        lineHeight: 1.2,
    },
    eduDegree: {
        fontSize: 11, // Increased from 9
        fontStyle: 'italic',
        color: '#4B5563',
        marginBottom: 2,
        lineHeight: 1.2,
    },
    eduDate: {
        fontSize: 10, // Increased from 8
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        padding: 3, // Increased from 2
        borderRadius: 2,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    // Skills
    skillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6, // Increased from 4
    },
    skillBadge: {
        fontSize: 10, // Increased from 8
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingHorizontal: 5, // Increased from 3
        paddingVertical: 2, // Increased from 1
        marginBottom: 4, // Increased from 3
        marginRight: 4, // Increased from 3
    },
    // Certs & Publications
    listItem: {
        fontSize: 10, // Increased from 8
        color: '#374151',
        marginBottom: 4, // Increased from 3
        lineHeight: 1.3,
    },
    pubLink: {
        fontSize: 10, // Increased from 8
        fontWeight: 'bold',
        color: '#1a1a1a',
        textDecoration: 'none',
    },
    pubUrl: {
        fontSize: 9, // Increased from 7
        color: '#6B7280',
        fontFamily: 'Courier',
    },
    // Languages
    langRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4, // Increased from 3
        marginBottom: 4, // Increased from 3
    },
    langName: {
        fontSize: 10, // Increased from 8
        fontWeight: 'medium',
        marginBottom: 2, // Increased from 1
    },
    langLevel: {
        fontSize: 9, // Increased from 7
        color: '#6B7280',
    },
    // Experience
    expItem: {
        marginBottom: 10, // Reduced from 25 to accommodate separator
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderBottomStyle: 'dotted',
        marginBottom: 15,
        marginTop: 5,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10, // Increased from 8
    },
    expRole: {
        fontSize: 14, // Increased from 11
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    expDate: {
        fontSize: 11, // Increased from 9
        color: '#6B7280',
    },
    expCompany: {
        fontSize: 11, // Increased from 9
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 12, // Increased from 10
        textTransform: 'uppercase',
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 3, // Increased from 2
    },
    bulletPoint: {
        width: 12,
        fontSize: 11, // Increased from 9
        color: '#374151',
        lineHeight: 1.5,
    },
    bulletText: {
        flex: 1,
        fontSize: 11, // Increased from 9
        color: '#374151',
        lineHeight: 1.5,
        textAlign: 'left',
    },
    summary: {
        fontSize: 12, // Increased from 10
        lineHeight: 1.5,
        color: '#1F2937',
        textAlign: 'left', // Changed from justify
        marginBottom: 25,
    },
});

interface ResumePDFProps {
    data: ResumeData;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
    // Guard: Don't render if data is missing critical fields
    if (!data) {
        return (
            <Document>
                <Page size="A3" style={styles.page}>
                    <View style={styles.container}>
                        <Text>Loading resume data...</Text>
                    </View>
                </Page>
            </Document>
        );
    }

    const {
        name = '',
        title = '',
        contact = { location: '', phone: '', email: '', linkedinUrl: '' },
        summary = '',
        experience = [],
        education = [],
        skills = {},
        languages = [],
        certifications = [],
        publications = []
    } = data;

    // Sanitize arrays to remove empty/invalid entries
    const safeExperience = (experience || []).filter(exp => exp && exp.role);
    const safeEducation = (education || []).filter(edu => edu && edu.institution);
    const safeLanguages = (languages || []).filter(lang => lang && lang.language);
    const safeCertifications = (certifications || []).filter(cert => cert && String(cert).trim());
    const safePublications = (publications || []).filter(pub => pub && pub.title);
    const safeSkills = Object.fromEntries(
        Object.entries(skills || {}).filter(([cat, list]) => cat && Array.isArray(list) && list.length > 0)
    );

    return (
        <Document title={`${String(data.resumeTitle || data.name || 'Resume')}`}>
            <Page size="A3" style={styles.page}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.name}>{String(name)}</Text>
                        <Text style={styles.title}>{String(title)}</Text>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactItem}>{String(contact?.location || '')}</Text>
                            <Text style={styles.contactItem}> | </Text>
                            <Link src={`tel:${String(contact?.phone || '').replace(/[^\d+]/g, '')}`} style={styles.link}>
                                <Text style={styles.contactItem}>{String(contact?.phone || '')}</Text>
                            </Link>
                            <Text style={styles.contactItem}> | </Text>
                            <Link src={`mailto:${String(contact?.email || '')}`} style={styles.link}>
                                <Text style={styles.contactItem}>{String(contact?.email || '')}</Text>
                            </Link>
                            <Text style={styles.contactItem}> | </Text>
                            <Link src={String(contact?.linkedinUrl || '#')} style={styles.link}>
                                <Text style={styles.contactItem}>LinkedIn</Text>
                            </Link>
                        </View>
                    </View>

                    {/* Main Layout */}
                    <View style={styles.mainLayout}>
                        {/* Sidebar */}
                        <View style={styles.sidebar}>
                            {/* Education */}
                            {safeEducation.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Education</Text>
                                {safeEducation.map((edu) => (
                                    <View key={edu.id || Math.random().toString()} style={styles.eduItem}>
                                        <Text style={styles.eduInst}>{String(edu.institution || '')}</Text>
                                        <Text style={styles.eduDegree}>{String(edu.degree || '')}</Text>
                                        <Text style={styles.eduDate}>{String(edu.period || '')}</Text>
                                    </View>
                                ))}
                            </View>
                            )}

                            {/* Skills */}
                            {Object.keys(safeSkills).length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Technical Skills</Text>
                                <View style={{ flexDirection: 'column', gap: 8 }}>
                                    {Object.entries(safeSkills).map(([category, skillList]) => (
                                        <View key={category} style={{ marginBottom: 4 }}>
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 }}>
                                                {String(category)}
                                            </Text>
                                            <View style={styles.skillRow}>
                                                {(Array.isArray(skillList) ? skillList : []).map((skill, idx) => (
                                                    <Text key={idx} style={styles.skillBadge}>{String(skill || '')}</Text>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            )}

                            {/* Certifications */}
                            {safeCertifications.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Certifications</Text>
                                {safeCertifications.map((cert, idx) => (
                                    <Text key={idx} style={styles.listItem}>• {String(cert || '')}</Text>
                                ))}
                            </View>
                            )}

                            {/* Publications */}
                            {safePublications.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Publications</Text>
                                {safePublications.map((pub, idx) => (
                                    <View key={idx} style={{ marginBottom: 6 }}>
                                        <Link src={String(pub.url || '#')} style={styles.pubLink}>
                                            <Text>{String(pub.title || '')}</Text>
                                        </Link>
                                        <Text style={styles.pubUrl}>{String(pub.url || '')}</Text>
                                    </View>
                                ))}
                            </View>
                            )}

                            {/* Languages */}
                            {safeLanguages.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Languages</Text>
                                {safeLanguages.map((lang, idx) => (
                                    <View key={idx} style={styles.langRow}>
                                        <Text style={styles.langName}>{String(lang.language || '')}</Text>
                                        <Text style={styles.langLevel}>{String(lang.proficiency || '').split('(')[0]}</Text>
                                    </View>
                                ))}
                            </View>
                            )}
                        </View>

                        {/* Main Content */}
                        <View style={styles.mainContent}>
                            {/* Profile */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Profile</Text>
                                <Text style={styles.summary}>{String(summary || '')}</Text>
                            </View>

                            {/* Experience */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Professional Experience</Text>
                                {safeExperience.map((job, index) => (
                                    <View key={job.id || index}>
                                        <View style={styles.expItem}>
                                            <View style={styles.expHeader}>
                                                <Text style={styles.expRole}>{String(job.role || '')}</Text>
                                                <Text style={styles.expDate}>{String(job.period || '')}</Text>
                                            </View>
                                            <Text style={styles.expCompany}>{String(job.company || '')} | {String(job.location || '')}</Text>
                                            <View style={{ flexDirection: 'column' }}>
                                                {(job.highlights || []).map((highlight, idx) => (
                                                    <View key={idx} style={{ marginBottom: idx < (job.highlights || []).length - 1 ? 10 : 0 }}>
                                                        <View style={styles.bulletRow}>
                                                            <Text style={styles.bulletPoint}>•</Text>
                                                            <Text style={styles.bulletText}>{String(highlight || '')}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                        {index < (experience || []).length - 1 && (
                                            <View style={styles.separator} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};



export default ResumePDF;
