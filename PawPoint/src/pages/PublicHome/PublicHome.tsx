import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { CSSProperties } from "react";

const ORANGE = "#f7ae1a";
const ORANGE_DARK = "#e39100";
const TEXT = "#071c42";
const SUBTEXT = "#516076";
const PAGE_BG = "#f7f5f0";
const CARD_BG = "#ffffff";
const BORDER = "#ead9b0";

type HeroSlide = {
  url: string;
  label: string;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type Step = {
  number: string;
  title: string;
  description: string;
};

const heroSlides: HeroSlide[] = [
  {
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=2000&q=90",
    label: "Golden Retriever Dog",
  },
  {
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2000&q=90",
    label: "British Shorthair Cat",
  },
  {
    url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=2000&q=90",
    label: "Domestic Rabbit",
  },
  {
    url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=2000&q=90",
    label: "Macaw Parrot",
  },
];

const features: Feature[] = [
  {
    icon: "📅",
    title: "Vet Appointments",
    description:
      "Book and manage vet appointments with ease. Never miss an important checkup.",
  },
  {
    icon: "❤️",
    title: "Health Tracking",
    description:
      "Keep detailed records of vaccinations, deworming, and complete medical history.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "Your pet’s data is stored safely and remains private at all times.",
  },
  {
    icon: "📱",
    title: "Always Accessible",
    description:
      "Access your pet’s information anytime, anywhere, on any device.",
  },
];

const steps: Step[] = [
  {
    number: "1",
    title: "Create Account",
    description: "Sign up for free and set up your profile in just a few seconds.",
  },
  {
    number: "2",
    title: "Add Your Pets",
    description: "Add your furry friends and their important health information.",
  },
  {
    number: "3",
    title: "Manage Everything",
    description: "Track medical records, make appointments, and set automatic reminders.",
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: PAGE_BG,
    fontFamily: "'DM Sans', sans-serif",
    overflowX: "hidden",
  } as CSSProperties,

  hero: {
    position: "relative",
    height: "100vh",
    minHeight: 640,
    overflow: "hidden",
  } as CSSProperties,

  slide: (active: boolean): CSSProperties => ({
    position: "absolute",
    inset: 0,
    opacity: active ? 1 : 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: active ? "scale(1)" : "scale(1.04)",
    transitionProperty: "opacity, transform",
    transitionDuration: "1.2s, 7s",
    transitionTimingFunction: "ease",
  }),

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(160deg, rgba(7,28,66,0.55) 0%, rgba(7,28,66,0.28) 60%, rgba(247,174,26,0.08) 100%)",
    zIndex: 1,
  } as CSSProperties,

  heroContent: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
  } as CSSProperties,

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(247,174,26,0.18)",
    border: "1px solid rgba(247,174,26,0.5)",
    borderRadius: 999,
    padding: "6px 18px",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: ORANGE,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "1.6rem",
    backdropFilter: "blur(8px)",
  } as CSSProperties,

  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.8rem, 7vw, 6rem)",
    fontWeight: 900,
    lineHeight: 1,
    color: "#fff",
    letterSpacing: "-0.02em",
    marginBottom: "1.4rem",
  } as CSSProperties,

  heroTitleSpan: {
    color: ORANGE,
    fontStyle: "italic",
    display: "block",
  } as CSSProperties,

  heroDesc: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    color: "rgba(255,255,255,0.88)",
    maxWidth: 640,
    lineHeight: 1.8,
    marginBottom: "2.4rem",
    fontWeight: 300,
  } as CSSProperties,

  heroBtns: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "3rem",
  } as CSSProperties,

  btnPrimary: {
    padding: "14px 36px",
    borderRadius: 14,
    background: ORANGE,
    color: TEXT,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 28px rgba(247,174,26,0.42)",
    transition: "all 0.2s",
    textDecoration: "none",
  } as CSSProperties,

  btnOutline: {
    padding: "14px 36px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.4)",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s",
    textDecoration: "none",
  } as CSSProperties,

  dots: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  } as CSSProperties,

  dot: (active: boolean): CSSProperties => ({
    width: active ? 28 : 8,
    height: 8,
    borderRadius: 999,
    background: active ? ORANGE : "rgba(255,255,255,0.45)",
    cursor: "pointer",
    transition: "all 0.3s",
    border: "none",
    padding: 0,
  }),

  slideLabel: (visible: boolean): CSSProperties => ({
    position: "absolute",
    bottom: "2.2rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    background: "rgba(7,28,66,0.52)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: "10px 22px",
    color: "rgba(255,255,255,0.9)",
    fontSize: "0.85rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.5s",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  }),

  featuresSection: {
    padding: "90px 5vw",
    backgroundColor: PAGE_BG,
  } as CSSProperties,

  featuresHeader: {
    textAlign: "center",
    marginBottom: "3.5rem",
  } as CSSProperties,

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  } as CSSProperties,

  featureCard: {
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 24,
    padding: "2.2rem",
    transition: "transform 0.25s, box-shadow 0.25s",
    cursor: "default",
  } as CSSProperties,

  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.4rem",
    fontSize: "1.5rem",
  } as CSSProperties,

  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.4rem",
    fontWeight: 700,
    color: TEXT,
    marginBottom: "0.7rem",
  } as CSSProperties,

  featureDesc: {
    fontSize: "0.97rem",
    color: SUBTEXT,
    lineHeight: 1.75,
  } as CSSProperties,

  statsSection: {
    padding: "90px 5vw",
    background: "linear-gradient(110deg, #071c42 0%, #0e2d5e 60%, #1a3a6e 100%)",
    position: "relative",
    overflow: "hidden",
  } as CSSProperties,

  statsGrid: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    textAlign: "center",
  } as CSSProperties,

  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.4rem, 5vw, 4rem)",
    fontWeight: 900,
    color: ORANGE,
    lineHeight: 1,
    marginBottom: "0.5rem",
  } as CSSProperties,

  statLabel: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 300,
  } as CSSProperties,

  howSection: {
    padding: "90px 5vw",
    backgroundColor: PAGE_BG,
  } as CSSProperties,

  howHeader: {
    textAlign: "center",
    marginBottom: "3.5rem",
  } as CSSProperties,

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "2rem",
    position: "relative",
  } as CSSProperties,

  stepCircle: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.4rem",
    boxShadow: "0 16px 36px rgba(247,174,26,0.28)",
  } as CSSProperties,

  stepNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.2rem",
    fontWeight: 900,
    color: "#fff",
  } as CSSProperties,

  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.35rem",
    fontWeight: 700,
    color: TEXT,
    marginBottom: "0.6rem",
  } as CSSProperties,

  stepDesc: {
    fontSize: "0.95rem",
    color: SUBTEXT,
    lineHeight: 1.75,
    maxWidth: 280,
    margin: "0 auto",
  } as CSSProperties,

  ctaSection: {
    padding: "90px 5vw",
    background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  } as CSSProperties,

  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
    fontWeight: 900,
    color: "#fff",
    marginBottom: "1rem",
    lineHeight: 1.1,
  } as CSSProperties,

  ctaSub: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.9)",
    maxWidth: 560,
    margin: "0 auto 2.4rem",
    lineHeight: 1.75,
  } as CSSProperties,

  btnCta: {
    display: "inline-block",
    padding: "16px 48px",
    borderRadius: 16,
    background: "#fff",
    color: TEXT,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.08rem",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 12px 36px rgba(7,28,66,0.18)",
    transition: "all 0.2s",
    textDecoration: "none",
  } as CSSProperties,

  eyebrow: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: ORANGE_DARK,
    marginBottom: "1rem",
  } as CSSProperties,

  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
    fontWeight: 900,
    color: TEXT,
    lineHeight: 1.1,
    marginBottom: "1rem",
  } as CSSProperties,

  sectionSub: {
    fontSize: "1.05rem",
    color: SUBTEXT,
    lineHeight: 1.8,
    maxWidth: 620,
    fontWeight: 300,
    margin: "0 auto",
  } as CSSProperties,
};

export const PublicHome = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
      setShowLabel(true);

      window.setTimeout(() => {
        setShowLabel(false);
      }, 2000);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [paused]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setShowLabel(true);

    window.setTimeout(() => {
      setShowLabel(false);
    }, 1900);
  };

  return (
    <div style={styles.page}>
      <div
        style={styles.hero}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              ...styles.slide(activeIndex === i),
              backgroundImage: `url(${slide.url})`,
            }}
          />
        ))}

        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ORANGE,
                display: "inline-block",
              }}
            />
            The #1 platform for pet health
          </div>

          <h1 style={styles.heroTitle}>
            Your pet’s health,
            <span style={styles.heroTitleSpan}>All in one place</span>
          </h1>

          <p style={styles.heroDesc}>
            PawPoint is the complete pet management platform — track medical
            records, schedule vet appointments, and never miss an important date.
          </p>

          <div style={styles.heroBtns}>
            <RouterLink to="/register" style={styles.btnPrimary}>
              Create free account →
            </RouterLink>

            <RouterLink to="/login" style={styles.btnOutline}>
              Sign in
            </RouterLink>
          </div>

          <div style={styles.dots}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                style={styles.dot(activeIndex === i)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        <div style={styles.slideLabel(showLabel)}>
          {heroSlides[activeIndex].label}
        </div>
      </div>

      <section style={styles.featuresSection}>
        <div style={styles.featuresHeader}>
          <div style={styles.eyebrow}>Features</div>
          <div style={styles.sectionTitle}>
            Everything you need for pet care
          </div>
          <p style={styles.sectionSub}>
            Complete tools to manage your pet’s health and well-being
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <div style={styles.featureTitle}>{feature.title}</div>
              <p style={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div>
            <div style={styles.statNum}>10,000+</div>
            <div style={styles.statLabel}>Happy pet owners</div>
          </div>
          <div>
            <div style={styles.statNum}>25,000+</div>
            <div style={styles.statLabel}>Pets managed</div>
          </div>
          <div>
            <div style={styles.statNum}>50,000+</div>
            <div style={styles.statLabel}>Appointments scheduled</div>
          </div>
        </div>
      </section>

      <section style={styles.howSection}>
        <div style={styles.howHeader}>
          <div style={styles.eyebrow}>How it works</div>
          <div style={{ ...styles.sectionTitle, textAlign: "center" }}>
            Three simple steps to get started
          </div>
        </div>

        <div style={styles.stepsGrid}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{ textAlign: "center", position: "relative", zIndex: 1 }}
            >
              <div style={styles.stepCircle}>
                <span style={styles.stepNum}>{step.number}</span>
              </div>
              <div style={styles.stepTitle}>{step.title}</div>
              <p style={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ ...styles.eyebrow, color: "rgba(255,255,255,0.7)" }}>
            Ready to get started?
          </div>

          <div style={styles.ctaTitle}>
            Join thousands of owners
            <br />
            who chose PawPoint
          </div>

          <p style={styles.ctaSub}>
            The complete platform for managing your pet’s health — free forever.
          </p>

          <RouterLink to="/register" style={styles.btnCta}>
            Create free account →
          </RouterLink>
        </div>
      </section>
    </div>
  );
};