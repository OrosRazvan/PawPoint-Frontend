import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link as RouterLink } from "react-router-dom";

const ORANGE = "#f7ae1a";
const ORANGE_DARK = "#e39100";
const TEXT = "#071c42";
const SUBTEXT = "#516076";
const PAGE_BG = "#f7f5f0";
const CARD_BG = "#ffffff";
const BORDER = "#ead9b0";

const heroImages = [
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1600&q=80",
];

const features = [
  {
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 30 }} />,
    title: "Appointment Scheduling",
    description:
      "Book and manage vet appointments with ease. Never miss an important checkup.",
  },
  {
    icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 30 }} />,
    title: "Health Tracking",
    description:
      "Keep detailed records of vaccinations, deworming, and medical history.",
  },
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: 30 }} />,
    title: "Secure & Private",
    description:
      "Your pet's data is stored securely and kept private at all times.",
  },
  {
    icon: <PhoneIphoneRoundedIcon sx={{ fontSize: 30 }} />,
    title: "Always Accessible",
    description:
      "Access your pet's information anytime, anywhere, on any device.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create Account",
    description: "Sign up for free and set up your profile in seconds.",
  },
  {
    number: "2",
    title: "Add Your Pets",
    description: "Add your furry friends and their important information.",
  },
  {
    number: "3",
    title: "Start Managing",
    description: "Track health records, book appointments, and set reminders.",
  },
];

export const PublicHome = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => heroImages, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: PAGE_BG }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 8, md: 12 }}>
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 620, sm: 700, md: 760 },
              borderRadius: { xs: "24px", md: "34px" },
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(7, 28, 66, 0.10)",
            }}
          >
            {slides.map((image, index) => (
              <Box
                key={image}
                sx={{
                  position: "absolute",
                  inset: 0,
                  opacity: activeIndex === index ? 1 : 0,
                  transition: "opacity 0.9s ease",
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: activeIndex === index ? "scale(1)" : "scale(1.03)",
                }}
              />
            ))}

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(7,28,66,0.26) 0%, rgba(7,28,66,0.42) 100%)",
              }}
            />

            <IconButton
              onClick={goPrev}
              sx={{
                position: "absolute",
                left: { xs: 10, md: 18 },
                top: "50%",
                transform: "translateY(-50%)",
                width: 48,
                height: 48,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.26)",
                },
              }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>

            <IconButton
              onClick={goNext}
              sx={{
                position: "absolute",
                right: { xs: 10, md: 18 },
                top: "50%",
                transform: "translateY(-50%)",
                width: 48,
                height: 48,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.26)",
                },
              }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>

            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                minHeight: { xs: 620, sm: 700, md: 760 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, sm: 4, md: 6 },
                py: { xs: 6, md: 8 },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 980,
                  borderRadius: { xs: "22px", md: "28px" },
                  px: { xs: 2.5, sm: 4, md: 6 },
                  py: { xs: 3.5, sm: 4.5, md: 5.5 },
                  textAlign: "center",
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.14)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "2.7rem", sm: "4rem", md: "5.2rem" },
                    lineHeight: 1.02,
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Your Pet&apos;s Health,
                  <br />
                  <Box component="span" sx={{ color: ORANGE }}>
                    All in One Place
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    mt: 3,
                    mx: "auto",
                    maxWidth: 900,
                    fontSize: { xs: "1.05rem", sm: "1.2rem", md: "1.55rem" },
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  PawPoint is the complete pet management platform that helps you
                  track health records, schedule appointments, and never miss
                  important care dates.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 4 }}
                >
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      px: 4.5,
                      py: 1.7,
                      borderRadius: "16px",
                      fontSize: "1.08rem",
                      fontWeight: 800,
                      textTransform: "none",
                      color: TEXT,
                      backgroundColor: ORANGE,
                      boxShadow: "0 12px 30px rgba(247, 174, 26, 0.35)",
                      "&:hover": {
                        backgroundColor: ORANGE_DARK,
                      },
                    }}
                  >
                    Create Free Account
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      px: 4.5,
                      py: 1.7,
                      borderRadius: "16px",
                      fontSize: "1.08rem",
                      fontWeight: 800,
                      textTransform: "none",
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.55)",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      "&:hover": {
                        borderColor: "#fff",
                        backgroundColor: "rgba(255,255,255,0.14)",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ mt: 3.5 }}
                >
                  {slides.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: activeIndex === index ? 26 : 10,
                        height: 10,
                        borderRadius: "999px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        backgroundColor:
                          activeIndex === index
                            ? ORANGE
                            : "rgba(255,255,255,0.55)",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>

          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "4rem" },
                fontWeight: 900,
                color: TEXT,
                lineHeight: 1.08,
              }}
            >
              Everything You Need for Pet Care
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: SUBTEXT,
                maxWidth: 900,
                lineHeight: 1.8,
              }}
            >
              Comprehensive tools to manage your pet&apos;s health and wellness
              journey
            </Typography>

            <Box
              sx={{
                mt: 2,
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  xl: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  elevation={0}
                  sx={{
                    minHeight: 290,
                    borderRadius: "24px",
                    backgroundColor: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 10px 24px rgba(7,28,66,0.04)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #f7ae1a 0%, #f39a0a 100%)",
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "1.9rem",
                        fontWeight: 800,
                        color: TEXT,
                        lineHeight: 1.2,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "1.08rem",
                        lineHeight: 1.8,
                        color: SUBTEXT,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Stack>

          <Box
            sx={{
              borderRadius: "28px",
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
              background:
                "linear-gradient(90deg, #f7ae1a 0%, #f39a0a 50%, #eb8500 100%)",
              boxShadow: "0 20px 40px rgba(247, 174, 26, 0.18)",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 4,
                textAlign: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "2.6rem", md: "3.6rem" },
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  10,000+
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#fffaf0" }}>
                  Happy Pet Owners
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "2.6rem", md: "3.6rem" },
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  25,000+
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#fffaf0" }}>
                  Pets Managed
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "2.6rem", md: "3.6rem" },
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  50,000+
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#fffaf0" }}>
                  Appointments Scheduled
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "4rem" },
                fontWeight: 900,
                color: TEXT,
              }}
            >
              How It Works
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: SUBTEXT,
                lineHeight: 1.7,
              }}
            >
              Get started with PawPoint in three simple steps
            </Typography>

            <Box
              sx={{
                mt: 2,
                width: "100%",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 5,
              }}
            >
              {steps.map((step) => (
                <Stack key={step.number} spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 84,
                      height: 84,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #f7ae1a 0%, #eb8500 100%)",
                      color: "#fff",
                      fontSize: "2rem",
                      fontWeight: 900,
                      boxShadow: "0 14px 28px rgba(247, 174, 26, 0.22)",
                    }}
                  >
                    {step.number}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: TEXT,
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      maxWidth: 360,
                      fontSize: "1.08rem",
                      lineHeight: 1.8,
                      color: SUBTEXT,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Stack>

          <Stack spacing={2.5} alignItems="center" textAlign="center" sx={{ pb: 4 }}>
            <Typography
              sx={{
                fontSize: { xs: "2.4rem", md: "4rem" },
                fontWeight: 900,
                color: TEXT,
              }}
            >
              Ready to Get Started?
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: SUBTEXT,
                maxWidth: 900,
                lineHeight: 1.8,
              }}
            >
              Join thousands of pet owners who trust PawPoint for their pet care
              management
            </Typography>

            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                px: 5,
                py: 1.7,
                borderRadius: "16px",
                fontSize: "1.08rem",
                fontWeight: 800,
                textTransform: "none",
                color: TEXT,
                backgroundColor: ORANGE,
                boxShadow: "0 12px 30px rgba(247, 174, 26, 0.32)",
                "&:hover": {
                  backgroundColor: ORANGE_DARK,
                },
              }}
            >
              Create Free Account
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};