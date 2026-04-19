import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import {
  contactMessageSchema,
  type ContactMessageFormValues,
} from "../../types/contactMessageSchema";
import { useCreateContactMessage } from "../../hooks/useCreateContactMessage";

export const ContactUs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["contact", "messages"]);
  const createMutation = useCreateContactMessage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageFormValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: ContactMessageFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      enqueueSnackbar(t("messages:contactMessageSent"), {
        variant: "success",
      });
      reset();
    } catch {
      enqueueSnackbar(t("messages:contactMessageFailed"), {
        variant: "error",
      });
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 32, fontWeight: 900, color: "#071c42" }}>
          {t("contact:title")}
        </Typography>

        <Typography sx={{ color: "#64748b" }}>
          {t("contact:subtitle")}
        </Typography>

        <Typography sx={{ color: "#64748b", fontSize: 14 }}>
          {t("contact:sentToAdminNote")}
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 5, maxWidth: 900 }}>
        <CardContent>
          <Stack
            component="form"
            spacing={2.5}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("contact:messageTitle")}
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("contact:description")}
                  multiline
                  minRows={6}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            {createMutation.isError && (
              <Alert severity="error">
                {t("messages:contactMessageFailed")}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || createMutation.isPending}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                px: 3,
              }}
            >
              {t("contact:send")}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};