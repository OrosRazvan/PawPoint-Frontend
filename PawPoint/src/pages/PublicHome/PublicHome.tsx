import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  GlobalStyles,
  Stack,
  Typography,
} from "@mui/material";

const ORANGE = "#f7ae1a";
const ORANGE_DARK = "#e39100";
const TEXT = "#071c42";
const SUBTEXT = "#516076";
const PAGE_BG = "#f7f5f0";
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

type FloatingPaw = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  fontSize: number;
  rotate: number;
  opacity: number;
};

type FloatingAnimal = {
  emoji: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  fontSize: string;
};

const floatingPaws: FloatingPaw[] = [
  { top: "12%", left: "6%", fontSize: 34, rotate: -18, opacity: 0.1 },
  { top: "28%", right: "8%", fontSize: 42, rotate: 12, opacity: 0.08 },
  { top: "58%", left: "10%", fontSize: 30, rotate: -10, opacity: 0.07 },
  { bottom: "18%", right: "12%", fontSize: 38, rotate: 18, opacity: 0.09 },
];

const floatingAnimals: FloatingAnimal[] = [
  { emoji: "🐶", top: "22%", right: "5%", fontSize: "4rem" },
  { emoji: "🐱", bottom: "18%", left: "6%", fontSize: "3.6rem" },
  { emoji: "🐰", top: "70%", right: "16%", fontSize: "3rem" },
];

export const PublicHome = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAGE_BG,
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <GlobalStyles
        styles={{
          "*": { boxSizing: "border-box" },
          body: { margin: 0 },
        }}
      />

      {floatingPaws.map((paw, index) => (
        <Box
          key={index}
          sx={{
            position: "fixed",
            zIndex: 0,
            pointerEvents: "none",
            color: `rgba(247,174,26,${paw.opacity})`,
            fontSize: paw.fontSize,
            transform: `rotate(${paw.rotate}deg)`,
            animation: "floatPaw 6s ease-in-out infinite",
            top: paw.top,
            bottom: paw.bottom,
            left: paw.left,
            right: paw.right,
          }}
        >
          🐾
        </Box>
      ))}

      {floatingAnimals.map((animal, index) => (
        <Box
          key={index}
          sx={{
            position: "fixed",
            zIndex: 0,
            pointerEvents: "none",
            filter: "drop-shadow(0 10px 20px rgba(7,28,66,0.15))",
            animation: "floatAnimal 7s ease-in-out infinite",
            top: animal.top,
            bottom: animal.bottom,
            left: animal.left,
            right: animal.right,
          }}
        >
          <Typography sx={{ fontSize: animal.fontSize }}>{animal.emoji}</Typography>
        </Box>
      ))}

      <GlobalStyles
        styles={{
          "@keyframes floatPaw": {
            "0%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-10px) rotate(6deg)" },
            "100%": { transform: "translateY(0px) rotate(0deg)" },
          },
          "@keyframes floatAnimal": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-12px)" },
            "100%": { transform: "translateY(0px)" },
          },
        }}
      />

      <Box
        component="section"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        sx={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden" }}
      >
        {heroSlides.map((slide, i) => {
          const active = activeIndex === i;

          return (
            <Box
              key={slide.label}
              aria-hidden={!active}
              sx={{
                position: "absolute",
                inset: 0,
                opacity: active ? 1 : 0,
                backgroundImage: `url(${slide.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: active ? "scale(1)" : "scale(1.04)",
                transitionProperty: "opacity, transform",
                transitionDuration: "1.2s, 7s",
                transitionTimingFunction: "ease",
              }}
            />
          );
        })}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(160deg, rgba(7,28,66,0.55) 0%, rgba(7,28,66,0.28) 60%, rgba(247,174,26,0.08) 100%)",
          }}
        />

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative", zIndex: 2, height: "100%", px: 2, textAlign: "center" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: "rgba(247,174,26,0.18)",
              border: "1px solid rgba(247,174,26,0.5)",
              borderRadius: 999,
              px: "18px",
              py: "6px",
              mb: "1.6rem",
              color: ORANGE,
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: ORANGE }} />
            <Box component="span">The #1 platform for pet health</Box>
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 7vw, 6rem)",
              fontWeight: 900,
              lineHeight: 1,
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: "1.4rem",
            }}
          >
            Your pet’s health,
            <Box component="span" sx={{ display: "block", color: ORANGE, fontStyle: "italic" }}>
              All in one place
            </Box>
          </Typography>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 6,
              px: { xs: 2.5, sm: 4 },
              py: { xs: 2, sm: 2.3 },
              maxWidth: 760,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              mb: "2.4rem",
            }}
          >
            <Typography sx={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, fontWeight: 300 }}>
              PawPoint is the complete pet management platform — track medical records, schedule vet appointments, and never miss an important date.
            </Typography>
          </Box>

          <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" spacing={1.5} sx={{ mb: "3rem" }}>
            <Button component={RouterLink} to="/register" disableElevation sx={{ px: "36px", py: "14px", borderRadius: "14px", bgcolor: ORANGE, color: TEXT, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, lineHeight: 1.2, textTransform: "none", boxShadow: "0 8px 28px rgba(247,174,26,0.42)", textDecoration: "none", "&:hover": { bgcolor: ORANGE, transform: "translateY(-1px)", boxShadow: "0 12px 32px rgba(247,174,26,0.48)" } }}>
              Create free account →
            </Button>

            <Button component={RouterLink} to="/login" disableElevation sx={{ px: "36px", py: "14px", borderRadius: "14px", bgcolor: "rgba(255,255,255,0.08)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 600, lineHeight: 1.2, border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", textTransform: "none", textDecoration: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.14)", transform: "translateY(-1px)", border: "1px solid rgba(255,255,255,0.55)" } }}>
              Sign in
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            {heroSlides.map((_, i) => {
              const active = activeIndex === i;
              return (
                <Box key={i} component="button" type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} sx={{ width: active ? 28 : 8, height: 8, borderRadius: 999, bgcolor: active ? ORANGE : "rgba(255,255,255,0.45)", cursor: "pointer", transition: "all 0.3s", border: "none", p: 0 }} />
              );
            })}
          </Stack>
        </Stack>

        <Box sx={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", zIndex: 3, bgcolor: "rgba(7,28,66,0.52)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "12px", px: "22px", py: "10px", color: "rgba(255,255,255,0.9)", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", opacity: showLabel ? 1 : 0, transition: "opacity 0.5s", pointerEvents: "none", whiteSpace: "nowrap" }}>
          {heroSlides[activeIndex].label}
        </Box>
      </Box>

      <Box component="section" sx={{ py: { xs: "72px", md: "100px" }, px: "5vw", bgcolor: PAGE_BG, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", bgcolor: "rgba(247,174,26,0.16)", filter: "blur(8px)", top: -90, right: -80 }} />

        <Box sx={{ textAlign: "center", mb: "3.5rem", position: "relative", zIndex: 1 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE_DARK, mb: "1rem" }}>
            Features
          </Typography>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 900, color: TEXT, lineHeight: 1.1, mb: "1rem" }}>
            Everything you need for pet care
          </Typography>
          <Typography sx={{ fontSize: "1.05rem", color: SUBTEXT, lineHeight: 1.8, maxWidth: 620, fontWeight: 300, mx: "auto" }}>
            Complete tools to manage your pet’s health and well-being
          </Typography>
        </Box>

        <Container maxWidth="lg" disableGutters sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {features.map((feature) => (
              <Card key={feature.title} elevation={0} sx={{ height: "100%", bgcolor: "rgba(255,255,255,0.84)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, borderRadius: 7, transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s", cursor: "default", overflow: "hidden", position: "relative", "&::before": { content: '""', position: "absolute", inset: "0 0 auto 0", height: 5, background: `linear-gradient(90deg, ${ORANGE} 0%, #eb8500 100%)` }, "&:hover": { transform: "translateY(-8px)", boxShadow: "0 24px 54px rgba(7,28,66,0.12)", borderColor: "rgba(247,174,26,0.65)" } }}>
                <CardContent sx={{ p: "2.2rem", "&:last-child": { pb: "2.2rem" } }}>
                  <Box sx={{ width: 62, height: 62, borderRadius: "20px", background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`, display: "flex", alignItems: "center", justifyContent: "center", mb: "1.4rem", fontSize: "1.55rem", boxShadow: "0 14px 30px rgba(247,174,26,0.28)" }}>
                    {feature.icon}
                  </Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: TEXT, mb: "0.7rem" }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.97rem", color: SUBTEXT, lineHeight: 1.75 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: "72px", md: "100px" }, px: "5vw", background: "linear-gradient(110deg, #071c42 0%, #0e2d5e 58%, #1a3a6e 100%)", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(247,174,26,0.18), transparent 28%), radial-gradient(circle at 88% 55%, rgba(255,255,255,0.09), transparent 24%)" }} />
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem", textAlign: "center" }}>
            {[["10,000+", "Happy pet owners"], ["25,000+", "Pets managed"], ["50,000+", "Appointments scheduled"]].map(([num, label]) => (
              <Box key={label} sx={{ p: { xs: 3, md: 4 }, borderRadius: 7, bgcolor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900, color: ORANGE, lineHeight: 1, mb: "0.5rem" }}>
                  {num}
                </Typography>
                <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.78)", fontWeight: 300 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: "72px", md: "105px" }, px: "5vw", bgcolor: PAGE_BG, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", bgcolor: "rgba(7,28,66,0.06)", left: -140, bottom: -140 }} />
        <Box sx={{ textAlign: "center", mb: "3.5rem", position: "relative", zIndex: 1 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE_DARK, mb: "1rem" }}>
            How it works
          </Typography>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 900, color: TEXT, lineHeight: 1.1, mb: "1rem", textAlign: "center" }}>
            Three simple steps to get started
          </Typography>
        </Box>

        <Container maxWidth="lg" disableGutters sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", position: "relative" }}>
            {steps.map((step) => (
              <Card key={step.number} elevation={0} sx={{ textAlign: "center", borderRadius: 7, bgcolor: "rgba(255,255,255,0.82)", border: `1px solid ${BORDER}`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 16px 42px rgba(7,28,66,0.06)" }}>
                <CardContent sx={{ p: { xs: 3, md: 4 }, "&:last-child": { pb: { xs: 3, md: 4 } } }}>
                  <Box sx={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: "1.4rem", boxShadow: "0 16px 36px rgba(247,174,26,0.28)", outline: "8px solid rgba(247,174,26,0.13)" }}>
                    <Typography component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 900, color: "#fff" }}>
                      {step.number}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: TEXT, mb: "0.6rem" }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: SUBTEXT, lineHeight: 1.75, maxWidth: 280, mx: "auto" }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: "78px", md: "110px" }, px: "5vw", background: `linear-gradient(135deg, ${ORANGE} 0%, #eb8500 100%)`, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.16)", top: -190, left: -120 }} />
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", bgcolor: "rgba(7,28,66,0.12)", right: -110, bottom: -130 }} />
        <Container maxWidth="md" disableGutters sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ p: { xs: 3, sm: 5, md: 6 }, borderRadius: 8, bgcolor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 28px 70px rgba(7,28,66,0.16)" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", mb: "1rem" }}>
              Ready to get started?
            </Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, color: "#fff", mb: "1rem", lineHeight: 1.1 }}>
              Join thousands of owners
              <br />
              who chose PawPoint
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.92)", maxWidth: 560, mx: "auto", mb: "2.4rem", lineHeight: 1.75 }}>
              The complete platform for managing your pet’s health — free forever.
            </Typography>
            <Button component={RouterLink} to="/register" disableElevation sx={{ display: "inline-flex", px: "48px", py: "16px", borderRadius: "16px", bgcolor: "#fff", color: TEXT, fontFamily: "'DM Sans', sans-serif", fontSize: "1.08rem", fontWeight: 700, lineHeight: 1.2, boxShadow: "0 12px 36px rgba(7,28,66,0.18)", textTransform: "none", textDecoration: "none", "&:hover": { bgcolor: "#fff", transform: "translateY(-1px)", boxShadow: "0 16px 42px rgba(7,28,66,0.22)" } }}>
              Create free account →
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
