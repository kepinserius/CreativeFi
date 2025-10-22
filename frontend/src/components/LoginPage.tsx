'use client';

import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // TODO: fetch API ke backend
    console.log({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(139,92,246,0.1), transparent 60%), radial-gradient(circle at bottom right, rgba(79,70,229,0.15), transparent 60%), #0b0b1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 0 30px rgba(139,92,246,0.1)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              m: "0 auto 1rem",
              bgcolor: "rgba(139,92,246,0.9)",
              boxShadow: "0 0 20px rgba(139,92,246,0.5)",
            }}
          >
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Login to <span style={{ color: "#a855f7" }}>CreativeFi</span>
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: "10px",
              background: "linear-gradient(to right, #8b5cf6, #6366f1)",
              boxShadow: "0 0 20px rgba(139,92,246,0.3)",
              "&:hover": {
                background: "linear-gradient(to right, #7c3aed, #4f46e5)",
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Link
                href="/register"
                style={{
                  textDecoration: "none",
                  color: "#a855f7",
                  fontWeight: 500,
                }}
              >
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
