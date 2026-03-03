import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Section from "../components/Section";
import HowIBuild from "../components/HowIBuild";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import TechStack from "../components/TechStack";
import ResumeSection from "../components/ResumeSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen font-body">
        <Hero />
        <Section id="how-i-build" title="How I Build">
          <HowIBuild />
        </Section>
        <Section id="experience" title="Experience">
          <Experience />
        </Section>
        <Section id="projects" title="Selected Projects">
          <Projects />
        </Section>
        <Section id="tech-stack" title="Tech Stack">
          <TechStack />
        </Section>
        <Section id="resume" title="Resume">
          <ResumeSection />
        </Section>
      </main>
    </>
  );
}
