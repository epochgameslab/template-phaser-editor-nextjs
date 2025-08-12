import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { CssVarsProvider } from '@mui/joy/styles';
import Header from '../Header';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider defaultMode="dark">
      <MeshProvider>
        <Header></Header>
        <Component {...pageProps} />
      </MeshProvider>
    </CssVarsProvider>
  );
}
