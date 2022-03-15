import {
  Button,
  Stack,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { ServicesProps, useServices } from "hooks/useService";
import { enablePasswordAuth } from "services/auth";

const authServices = {
  enablePasswordAuth,
};

export function SetupPasswordAuth({ onSuccess }: { onSuccess: () => void }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const authService = useServices(authServices);

  const enablePasswordAuth = () => {
    authService.enablePasswordAuth(password1).then((data) => {
      if (data.result == "success") {
        onSuccess();
      }
    });
  };

  return (
    <Stack spacing={3} width={300}>
      <TextField
        type="password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
        label="Enter your Password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
      />
      <TextField
        type="password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
        error={password1 !== password2}
        helperText={password1 && password1 !== password2 && "Passwords do not match"}
        label="Enter your Password again"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <Msgs authService={authService} />
      <Button
        variant="contained"
        sx={{ width: "100%" }}
        onClick={enablePasswordAuth}
        disabled={password1 !== password2}
      >
        Confirm
      </Button>
    </Stack>
  );
}

const Msgs = (props: { authService: ServicesProps<typeof authServices> }) => {
  if (props.authService.data.result == "waiting") return <></>;
  if (props.authService.data.result == "loading")
    return <Info>Verifying the password...</Info>;
  if (props.authService.data.result == "validation-error")
    return <Error>Wrong password.</Error>;
  return (
    <Error>We could not verify your password. Please try again later.</Error>
  );
};

const Error = styled("p")({
  textAlign: "center",
  marginBottom: "10px",
  color: "#d74646",
});

const Info = styled("p")({
  textAlign: "center",
  marginBottom: "10px",
  color: "#dddddd",
});
