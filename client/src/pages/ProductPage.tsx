import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { fetchProducts } from "../lib/csv-parser";
import { Product, PRODUCT_SLUG_MAPPING } from "../types";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Check, Sparkles, X } from "lucide-react";
import { Link } from "wouter";

// Model Images
const models = [
  { id: "model1", name: "Model 1", src: "/assets/models/model1.jpeg" },
  { id: "model2", name: "Model 2", src: "/assets/models/model2.jpeg" }, // Using model1 as placeholder for model2 based on previous copy
  { id: "model3", name: "Model 3", src: "/assets/models/model3.png" },
];

export default function ProductPage() {
  const [, params] = useRoute("/product/:handle");
  const handle = params?.handle;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [step, setStep] = useState<"guide" | "selection" | "loading" | "result">("guide");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  // Try-on state
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    if (handle) {
      fetchProducts()
        .then((data) => {
          const found = data.find((p) => p.handle === handle);
          setProduct(found || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [handle]);

  const startTryOn = () => {
    setIsTryOnOpen(true);
    setStep("guide");
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setStep("loading");
    
    // Simulate AI processing
    setTimeout(() => {
      if (product) {
        const productSlug = PRODUCT_SLUG_MAPPING[product.handle] || product.handle;
        // Logic: /AI TRY ON IMAGE/[product-slug]-[model-name].png
        // Our asset path: /assets/try-on/[product-slug]-[model-id].png
        const resultPath = `/assets/try-on/${productSlug}-${modelId}.png`;
        setResultImage(resultPath);
        setStep("result");
      }
    }, 6000);
  };

  if (loading || !product) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden relative">
            <img 
              src={product.imageSrc} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
              <p className="text-2xl mt-4 font-medium">${product.price}</p>
            </div>
            
            <div 
              className="prose prose-stone dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: product.body }}
            />

            <div className="pt-6">
              <Button size="lg" className="w-full md:w-auto text-lg px-8 py-6 rounded-full" onClick={() => {}}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          onClick={startTryOn}
          size="lg" 
          className="rounded-full shadow-2xl h-16 px-8 text-lg font-bold bg-black hover:bg-zinc-800 text-white transition-all hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-300"
        >
          <Sparkles className="mr-2 h-5 w-5 text-yellow-400 animate-pulse" />
          SEE IT ON ME
        </Button>
      </div>

      {/* Virtual Try-On Modal */}
      <Dialog open={isTryOnOpen} onOpenChange={setIsTryOnOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl bg-zinc-950 text-white">
          <div className="p-6 h-[600px] flex flex-col relative">
            
            {/* Header with Rainbow Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
            
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                AI Fitting Labs
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsTryOnOpen(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Step 1: Guide */}
            {step === "guide" && (
              <div className="flex flex-col items-center justify-between h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Virtual Fitting Room</h3>
                  <p className="text-zinc-400 text-sm">See how this looks on a model before you buy.</p>
                </div>
                
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden my-4 border border-zinc-800">
                  <img 
                    src="https://raw.githubusercontent.com/nikhjoshi123/vton-engine/main/AIFittingLabs-Assest.jpeg" 
                    alt="Fitting Guide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <ul className="text-sm space-y-2 text-left">
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> Hair pulled back</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> Hands visible</li>
                        <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> Wear fitted clothes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button className="w-full py-6 text-lg bg-white text-black hover:bg-zinc-200" onClick={() => setStep("selection")}>
                  Start Fitting
                </Button>
              </div>
            )}

            {/* Step 2: Model Selection */}
            {step === "selection" && (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Choose a Model</h3>
                  <p className="text-zinc-400 text-sm">Select a model that best represents you.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-auto">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className="group relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <img 
                        src={model.src} 
                        alt={model.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <span className="text-xs font-medium">{model.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Loading */}
            {step === "loading" && (
              <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text animate-pulse">
                  AI Processing...
                </h3>
                <p className="text-zinc-500 text-sm mt-2">Trying on {product.title}</p>
              </div>
            )}

            {/* Step 4: Result */}
            {step === "result" && (
              <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                <div className="flex-1 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                  <img 
                    src={resultImage || product.imageSrc} 
                    alt="Try-on Result"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to original image if AI image is missing
                      (e.target as HTMLImageElement).src = product.imageSrc;
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <p className="text-xs text-center text-zinc-300">AI Generated Result</p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button variant="outline" className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white" onClick={() => setStep("selection")}>
                    Try Another Model
                  </Button>
                  <Button className="flex-1 bg-white text-black hover:bg-zinc-200" onClick={() => setIsTryOnOpen(false)}>
                    Looks Good!
                  </Button>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
