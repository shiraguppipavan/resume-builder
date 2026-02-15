import React from 'react';
import { Icons } from './components/Icon';
import { Section } from './components/Section';
import { ExperienceCard } from './components/ExperienceCard';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './components/ResumePDF';
import { useResumes } from './hooks/useResumes';
import { Sidebar } from './components/Sidebar';


const App: React.FC = () => {
  const {
    resumes,
    currentResume,
    updateCurrentResume,
    createResume,
    deleteResume,
    selectResume,
    renameResume,
    duplicateResume
  } = useResumes();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Drag-and-drop state for experience reordering
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleAddSkill = (category: string) => {
    const newSkills = { ...currentResume.skills };
    if (!newSkills[category]) {
      newSkills[category] = [];
    }
    newSkills[category].push(''); // Add an empty skill
    updateCurrentResume({ skills: newSkills });
  };

  const handleUpdateSkill = (category: string, skillIndex: number, newValue: string) => {
    const newSkills = { ...currentResume.skills };
    if (newSkills[category] && newSkills[category][skillIndex] !== undefined) {
      newSkills[category][skillIndex] = newValue;
      updateCurrentResume({ skills: newSkills });
    }
  };

  const handleDeleteSkill = (category: string, skillIndex: number) => {
    const newSkills = { ...currentResume.skills };
    if (newSkills[category]) {
      newSkills[category].splice(skillIndex, 1);
      if (newSkills[category].length === 0) {
        delete newSkills[category]; // Remove category if no skills left
      }
      updateCurrentResume({ skills: newSkills });
    }
  };

  const handleUpdateCategoryName = (oldCategory: string, newCategory: string) => {
    if (oldCategory === newCategory) return;
    const newSkills = { ...currentResume.skills };
    if (newSkills[oldCategory]) {
      newSkills[newCategory] = newSkills[oldCategory];
      delete newSkills[oldCategory];
      updateCurrentResume({ skills: newSkills });
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const newSkills = { ...currentResume.skills };
    delete newSkills[categoryToDelete];
    updateCurrentResume({ skills: newSkills });
  };

  const handleAddCategory = () => {
    const newSkills = { ...currentResume.skills };
    let newCategoryName = 'New Category';
    let i = 1;
    while (newSkills[newCategoryName]) {
      newCategoryName = `New Category ${i++}`;
    }
    newSkills[newCategoryName] = ['']; // Add with one empty skill
    updateCurrentResume({ skills: newSkills });
  };

  // --- Drag-and-drop handlers for experiences ---
  const handleExpDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleExpDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragOverIndex(null);
      return;
    }
    setDragOverIndex(index);
  };

  const handleExpDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIdx) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newExp = [...currentResume.experience];
    const [moved] = newExp.splice(dragIndex, 1);
    newExp.splice(dropIdx, 0, moved);
    updateCurrentResume({ experience: newExp });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleExpDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };


  // Guard: Don't render until we have a valid resume
  if (!currentResume || !currentResume.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (

    <div className={`min-h-screen py-8 md:py-12 print:p-0 flex justify-center items-start print:block font-sans bg-[#f3f4f6] transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-12'} print:pl-0`}>
      <Sidebar
        resumes={resumes}
        currentId={currentResume.id!}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelect={selectResume}
        onCreate={createResume}
        onDelete={deleteResume}
        onDuplicate={duplicateResume}
        onRename={renameResume}
      />

      {/* Action Bar (Hidden in Print) */}
      <div className="fixed bottom-8 right-8 z-[100] no-print flex flex-col gap-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all cursor-pointer ${isEditing ? 'bg-blue-600 text-white' : 'bg-white text-dark'
            } hover:scale-105`}
        >
          <Icons.Pencil size={20} />
          <span className="font-semibold text-sm">
            {isEditing ? 'Preview Mode' : 'Edit Mode'}
          </span>
        </button>

        <PDFDownloadLink
          key={`pdf-${currentResume.id}-${currentResume.updatedAt || ''}`}
          document={<ResumePDF data={currentResume} />}
          fileName={`${(currentResume.resumeTitle || currentResume.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`}
          className="no-print"
        >
          {({ loading, error }) => (
            <button
              className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all cursor-pointer w-full"
              title="Save as PDF"
              disabled={loading || !!error}
            >
              <Icons.Download size={20} />
              <span className="font-semibold text-sm">
                {loading ? 'Generating...' : error ? 'Error' : 'Save as PDF'}
              </span>
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Resume Paper Container */}
      <div className="resume-container w-full max-w-[297mm] bg-white shadow-2xl print:shadow-none min-h-[420mm] print:min-h-0 flex flex-col print:block relative z-10 transition-all duration-300">

        {/* Bold Header with Dark Background */}
        <header className="bg-[#1a1a1a] text-white px-8 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8 print:px-8 print:pt-6 print:pb-6">
          <div className="flex flex-col items-center text-center">
            {isEditing ? (
              <input
                className="bg-transparent text-center border-b border-gray-600 font-serif text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 outline-none w-full max-w-2xl px-2 focus:border-blue-400"
                value={currentResume.name}
                onChange={(e) => updateCurrentResume({ name: e.target.value })}
              />
            ) : (
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {currentResume.name}
              </h1>
            )}

            {isEditing ? (
              <input
                className="bg-transparent text-center border-b border-gray-600 font-mono text-xs md:text-sm text-gray-300 uppercase tracking-widest mb-5 outline-none w-full max-w-xl px-2 focus:border-blue-400"
                value={currentResume.title}
                onChange={(e) => updateCurrentResume({ title: e.target.value })}
              />
            ) : (
              <p className="font-mono text-xs md:text-sm text-gray-300 uppercase tracking-widest mb-5">
                {currentResume.title}
              </p>
            )}

            {/* Compact Contact Info */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <Icons.MapPin size={14} className="text-gray-400" />
                {isEditing ? (
                  <input
                    className="bg-transparent border-b border-gray-600 outline-none focus:border-blue-400"
                    value={currentResume.contact.location}
                    onChange={(e) => updateCurrentResume({ contact: { ...currentResume.contact, location: e.target.value } })}
                  />
                ) : (
                  <span>{currentResume.contact.location}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Icons.Phone size={14} className="text-gray-400" />
                {isEditing ? (
                  <input
                    className="bg-transparent border-b border-gray-600 outline-none focus:border-blue-400"
                    value={currentResume.contact.phone}
                    onChange={(e) => updateCurrentResume({ contact: { ...currentResume.contact, phone: e.target.value } })}
                  />
                ) : (
                  <a href={`tel:${currentResume.contact.phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">
                    {currentResume.contact.phone}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Icons.Mail size={14} className="text-gray-400" />
                {isEditing ? (
                  <input
                    className="bg-transparent border-b border-gray-600 outline-none focus:border-blue-400"
                    value={currentResume.contact.email}
                    onChange={(e) => updateCurrentResume({ contact: { ...currentResume.contact, email: e.target.value } })}
                  />
                ) : (
                  <a href={`mailto:${currentResume.contact.email}`} className="hover:text-white transition-colors">
                    {currentResume.contact.email}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Icons.Linkedin size={14} className="text-gray-400" />
                {isEditing ? (
                  <input
                    className="bg-transparent border-b border-gray-600 outline-none focus:border-blue-400"
                    placeholder="LinkedIn URL"
                    value={currentResume.contact.linkedinUrl}
                    onChange={(e) => updateCurrentResume({ contact: { ...currentResume.contact, linkedinUrl: e.target.value } })}
                  />
                ) : (
                  <a href={currentResume.contact.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content 2-Column Grid */}
        <div className="flex flex-col md:flex-row print:flex-row flex-grow">

          {/* Left Sidebar (32%) */}
          <aside className="md:w-[32%] print:w-[32%] bg-gray-50 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200 print:bg-transparent print:border-r print:border-gray-200 print:pl-0">
            <div className="flex flex-col gap-12">

              {/* Education */}
              <Section title="Education" className="mb-0">
                <div className="flex flex-col gap-8">
                  {currentResume.education.map((edu, idx) => (
                    <div key={edu.id} className="relative group/edu">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <input
                                className="bg-transparent font-bold text-sm text-dark border-b border-gray-200 outline-none focus:border-blue-400"
                                value={edu.institution}
                                onChange={(e) => {
                                  const newEdu = [...currentResume.education];
                                  newEdu[idx] = { ...edu, institution: e.target.value };
                                  updateCurrentResume({ education: newEdu });
                                }}
                              />
                              <input
                                className="bg-transparent text-xs text-gray-600 italic border-b border-gray-200 outline-none focus:border-blue-400"
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...currentResume.education];
                                  newEdu[idx] = { ...edu, degree: e.target.value };
                                  updateCurrentResume({ education: newEdu });
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold text-sm text-dark mb-1.5 leading-tight">{edu.institution}</h3>
                              <p className="text-xs text-gray-600 italic mb-2.5 leading-relaxed">{edu.degree}</p>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newEdu = currentResume.education.filter((_, i) => i !== idx);
                              updateCurrentResume({ education: newEdu });
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors pt-1"
                            title="Remove education"
                          >
                            <Icons.Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {isEditing ? (
                        <input
                          className="font-mono text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm outline-none focus:border-blue-400 w-full"
                          value={edu.period}
                          onChange={(e) => {
                            const newEdu = [...currentResume.education];
                            newEdu[idx] = { ...edu, period: e.target.value };
                            updateCurrentResume({ education: newEdu });
                          }}
                        />
                      ) : (
                        <span className="inline-block font-mono text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm">
                          {edu.period}
                        </span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => {
                        updateCurrentResume({
                          education: [
                            ...currentResume.education,
                            { id: crypto.randomUUID(), institution: "New Institution", degree: "Degree", period: "Period" }
                          ]
                        });
                      }}
                      className="text-xs text-blue-600 hover:underline mt-2 text-left"
                    >
                      + Add Education
                    </button>
                  )}

                </div>
              </Section>

              {/* Skills */}
              <Section title="Technical Skills" className="mb-0">
                <div className="flex flex-col gap-4">
                  {Object.entries(currentResume.skills).map(([category, skills]) => (
                    <div key={category} className="group/cat relative">
                      {isEditing ? (
                        <div className="flex items-center justify-between mb-2">
                          <input
                            className="text-xs font-bold text-gray-500 uppercase tracking-wider outline-none border-b border-blue-100 focus:border-blue-400 flex-1"
                            defaultValue={category}
                            onBlur={(e) => handleUpdateCategoryName(category, e.target.value)}
                          />
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="ml-2 text-gray-300 hover:text-red-500"
                          >
                            <Icons.Trash2 size={10} />
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                      )}

                      <div className="flex flex-wrap gap-x-2 gap-y-2">
                        {(skills as string[]).map((skill, idx) => (
                          <div key={idx} className="flex items-center">
                            {isEditing ? (
                              <div className="flex items-center gap-1 group/skill">
                                <input
                                  className="text-xs px-2 py-1 bg-blue-50 border border-blue-200 outline-none focus:border-blue-400 min-w-[60px]"
                                  value={skill}
                                  onChange={(e) => handleUpdateSkill(category, idx, e.target.value)}
                                />
                                <button
                                  onClick={() => handleDeleteSkill(category, idx)}
                                  className="text-gray-300 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs px-2 py-1 bg-white border border-gray-300">
                                {skill}
                              </span>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <button
                            onClick={() => handleAddSkill(category)}
                            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 border border-dashed border-blue-200"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={handleAddCategory}
                      className="text-xs text-blue-600 hover:underline mt-2 text-left"
                    >
                      + Add Skill Category
                    </button>
                  )}
                </div>
              </Section>


              {/* Certifications */}
              {(currentResume.certifications.length > 0 || isEditing) && (
                <Section title="Certifications" className="mb-0">
                  <ul className="flex flex-col gap-4">
                    {currentResume.certifications.map((cert, idx) => (
                      <li key={idx} className="group/cert relative flex items-start gap-2 text-xs text-gray-700 leading-relaxed pr-6">
                        <Icons.Award size={12} className="text-black mt-0.5 shrink-0" />
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              className="bg-transparent border-b border-gray-200 outline-none focus:border-blue-400 w-full"
                              value={cert}
                              onChange={(e) => {
                                const newCerts = [...currentResume.certifications];
                                newCerts[idx] = e.target.value;
                                updateCurrentResume({ certifications: newCerts });
                              }}
                            />
                            <button
                              onClick={() => {
                                const newCerts = currentResume.certifications.filter((_, i) => i !== idx);
                                updateCurrentResume({ certifications: newCerts });
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span>{cert}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditing && (
                    <button
                      onClick={() => updateCurrentResume({ certifications: [...currentResume.certifications, 'New Certification'] })}
                      className="text-[10px] text-blue-600 hover:underline mt-2"
                    >
                      + Add Certification
                    </button>
                  )}
                </Section>
              )}

              {/* Publications / Links */}
              {(currentResume.publications.length > 0 || isEditing) && (
                <Section title="Publications" className="mb-0">
                  <div className="flex flex-col gap-4">
                    {currentResume.publications.map((pub, idx) => (
                      <div key={idx} className="group/pub relative flex flex-col items-start gap-1 pr-6">
                        {isEditing ? (
                          <div className="flex items-start gap-2 w-full">
                            <div className="flex-1">
                              <input
                                className="text-xs font-bold text-dark border-b border-gray-200 outline-none focus:border-blue-400 mb-1 w-full"
                                value={pub.title}
                                onChange={(e) => {
                                  const newPubs = [...currentResume.publications];
                                  newPubs[idx] = { ...pub, title: e.target.value };
                                  updateCurrentResume({ publications: newPubs });
                                }}
                              />
                              <input
                                className="text-[10px] font-mono text-gray-500 border-b border-gray-200 outline-none focus:border-blue-400 w-full"
                                value={pub.url}
                                onChange={(e) => {
                                  const newPubs = [...currentResume.publications];
                                  newPubs[idx] = { ...pub, url: e.target.value };
                                  updateCurrentResume({ publications: newPubs });
                                }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newPubs = currentResume.publications.filter((_, i) => i !== idx);
                                updateCurrentResume({ publications: newPubs });
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors pt-1"
                            >
                              <Icons.Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex flex-col"
                          >
                            <span className="text-xs font-bold text-dark group-hover:underline flex items-center gap-1">
                              {pub.title} <Icons.ExternalLink size={10} className="text-gray-400" />
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 truncate mt-0.5">{pub.url}</span>
                          </a>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        onClick={() => updateCurrentResume({ publications: [...currentResume.publications, { title: "New Publication", url: "" }] })}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        + Add Publication
                      </button>
                    )}
                  </div>
                </Section>
              )}

              {/* Languages */}
              {(currentResume.languages.length > 0 || isEditing) && (
                <Section title="Languages" className="mb-0">
                  <div className="flex flex-col gap-3">
                    {currentResume.languages.map((lang, idx) => (
                      <div key={idx} className="group/lang relative flex items-start gap-2 border-b border-gray-200 pb-1.5 last:border-0 pr-6">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex flex-col items-start text-xs">
                              <input
                                className="font-medium text-dark bg-transparent border-b border-gray-100 outline-none focus:border-blue-400 w-full mb-1"
                                value={lang.language}
                                onChange={(e) => {
                                  const newLangs = [...currentResume.languages];
                                  newLangs[idx] = { ...lang, language: e.target.value };
                                  updateCurrentResume({ languages: newLangs });
                                }}
                              />
                              <input
                                className="text-gray-500 text-[10px] bg-transparent border-b border-gray-100 outline-none focus:border-blue-400 w-full"
                                value={lang.proficiency}
                                onChange={(e) => {
                                  const newLangs = [...currentResume.languages];
                                  newLangs[idx] = { ...lang, proficiency: e.target.value };
                                  updateCurrentResume({ languages: newLangs });
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-start text-xs">
                              <span className="font-medium text-dark mb-0.5">{lang.language}</span>
                              <span className="text-gray-500 text-[10px]">{lang.proficiency.split('(')[0]}</span>
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newLangs = currentResume.languages.filter((_, i) => i !== idx);
                              updateCurrentResume({ languages: newLangs });
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors pt-1"
                          >
                            <Icons.Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        onClick={() => updateCurrentResume({ languages: [...currentResume.languages, { language: "New Language", proficiency: "" }] })}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        + Add Language
                      </button>
                    )}
                  </div>
                </Section>
              )}

            </div>
          </aside>

          {/* Right Main Content (68%) */}
          <main className="md:w-[68%] print:w-[68%] p-8 md:p-12 print:pr-0">

            {/* Profile / Summary */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4 flex items-center gap-2">
                Profile
              </h2>
              {isEditing ? (
                <textarea
                  className="w-full text-sm leading-relaxed text-gray-800 font-sans bg-gray-50 p-3 rounded border border-gray-200 outline-none focus:border-blue-400 min-h-[150px]"
                  value={currentResume.summary}
                  onChange={(e) => updateCurrentResume({ summary: e.target.value })}
                />
              ) : (
                <p className="text-sm leading-relaxed text-gray-800 font-sans" style={{ hyphens: 'none' }}>
                  {currentResume.summary}
                </p>
              )}
            </div>

            {/* Experience */}
            <Section title="Professional Experience">
              <div className="flex flex-col">
                {currentResume.experience.map((job, index) => (
                  <div
                    key={job.id}
                    className={`relative group/exp ${isEditing ? 'cursor-default' : ''
                      } ${dragIndex === index ? 'opacity-40' : ''}`}
                    draggable={isEditing}
                    onDragStart={() => handleExpDragStart(index)}
                    onDragOver={(e) => handleExpDragOver(e, index)}
                    onDrop={(e) => handleExpDrop(e, index)}
                    onDragEnd={handleExpDragEnd}
                  >
                    {/* Drop indicator line */}
                    {isEditing && dragOverIndex === index && dragIndex !== null && dragIndex > index && (
                      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
                    )}

                    <div className="flex items-start gap-0">
                      {/* Drag handle — only in edit mode */}
                      {isEditing && (
                        <div
                          className="pt-1 pr-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0 opacity-0 group-hover/exp:opacity-100"
                          title="Drag to reorder"
                        >
                          <Icons.GripVertical size={16} />
                        </div>
                      )}

                      <div className="flex-1">
                        <ExperienceCard
                          data={job}
                          isLast={index === currentResume.experience.length - 1}
                          isEditing={isEditing}
                          onUpdate={(updated) => {
                            const newExp = [...currentResume.experience];
                            newExp[index] = { ...job, ...updated };
                            updateCurrentResume({ experience: newExp });
                          }}
                        />
                      </div>

                      {/* Delete button */}
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newExp = currentResume.experience.filter((_, i) => i !== index);
                            updateCurrentResume({ experience: newExp });
                          }}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover/exp:opacity-100 transition-opacity p-2 shrink-0"
                          title="Delete entire experience entry"
                        >
                          <Icons.Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Drop indicator line (below) */}
                    {isEditing && dragOverIndex === index && dragIndex !== null && dragIndex < index && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => {
                      const newJob = {
                        id: crypto.randomUUID(),
                        role: "New Role",
                        company: "New Company",
                        location: "Location",
                        period: "Period",
                        highlights: ["New highlight"]
                      };
                      updateCurrentResume({ experience: [...currentResume.experience, newJob] });
                    }}
                    className="text-sm text-blue-600 hover:underline mt-4 flex items-center gap-1 self-start"
                  >
                    + Add Experience
                  </button>
                )}
              </div>
            </Section>


          </main>
        </div>
      </div>
    </div>
  );
};


export default App;