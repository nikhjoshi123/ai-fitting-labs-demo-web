import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster"; // Fixed path
import { TooltipProvider } from "./components/ui/tooltip"; // Fixed path
import NotFound from "./pages/not-found"; // Fixed path
import Home from "./pages/Home"; // Fixed path
import ProductPage from "./pages/ProductPage"; // Fixed path
