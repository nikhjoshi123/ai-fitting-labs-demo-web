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
    
    // Simulate AI processing - increased to 15 seconds
    setTimeout(() => {
      if (product) {
        const productSlug = PRODUCT_SLUG_MAPPING[product.handle] || product.handle;
        const resultPath = `/assets/try-on/${productSlug}-${modelId}.png`;
        setResultImage(resultPath);
        setStep("result");
      }
    }, 15000);
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
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-0 shadow-2xl bg-zinc-950 text-white">
          <div className="flex flex-col md:flex-row h-[600px] relative">
            
            {/* Header with Rainbow Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 z-50" />
            
            <Button variant="ghost" size="icon" onClick={() => setIsTryOnOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white hover:bg-zinc-800 z-50">
              <X className="h-5 w-5" />
            </Button>

            {/* Left Side: Guide/Static Content */}
            <div className="w-full md:w-1/2 bg-zinc-900/50 p-8 flex flex-col border-r border-zinc-800">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-8">
                AI Fitting Labs
              </h2>

              <div className="flex-1">
                {step === "guide" ? (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <h3 className="text-3xl font-bold leading-tight">Your Virtual Mirror</h3>
                    <p className="text-zinc-400">Experience high-precision AI fitting. To get the best result, follow our professional guidance.</p>
                    
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">1</div>
                        <p className="text-sm text-zinc-300">Ensure your hair is pulled back or away from shoulders.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">2</div>
                        <p className="text-sm text-zinc-300">Keep your hands visible at your sides or front.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">3</div>
                        <p className="text-sm text-zinc-300">Wear fitted clothing for the most accurate drape.</p>
                      </div>
                    </div>
                  </div>
                ) : step === "result" ? (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <h3 className="text-3xl font-bold leading-tight">The Perfect Match?</h3>
                    <p className="text-zinc-400">How do you think you look like? We think you look perfect on it!</p>
                    
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                      <p className="text-red-400 font-bold flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        5 trials left!
                      </p>
                      <p className="text-xs text-red-400/80 mt-1">Hurry now before it ends. Don't wait to see how this product looks on you.</p>
                    </div>

                    <div className="pt-4">
                       <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-6 text-lg rounded-xl shadow-xl shadow-white/5">
                        BUY NOW
                      </Button>
                      <button onClick={() => setStep("selection")} className="w-full text-zinc-500 hover:text-white text-sm mt-4 transition-colors">
                        ← Try another model
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <h3 className="text-3xl font-bold leading-tight">Almost Ready</h3>
                    <p className="text-zinc-400">Our AI engine is analyzing the fabric drape and lighting to create your personalized preview.</p>
                    
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
                      <img src={product.imageSrc} alt="Analyzing" className="w-full h-full object-cover opacity-40 grayscale" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-32 h-32 border-2 border-zinc-700 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="h-10 w-10 text-zinc-500" />
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 mt-auto border-t border-zinc-800/50">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Privacy Note: We do not save your images on our servers. All processing is end-to-end encrypted for your safety.
                </p>
              </div>
            </div>

            {/* Right Side: Interactive Content */}
            <div className="w-full md:w-1/2 p-8 flex flex-col bg-black">
              {step === "guide" && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-700">
                   <div className="flex-1 flex flex-col">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 mb-8">
                      <img 
                        src="https://raw.githubusercontent.com/nikhjoshi123/vton-engine/main/AIFittingLabs-Assest.jpeg" 
                        alt="Fitting Guide"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">Reference Pose</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                      <p className="text-xs text-zinc-400 font-medium italic">"For your customers, use this on yourself. You have to buy this service to make it perfect for your own needs."</p>
                    </div>
                    <Button className="w-full py-7 text-lg bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl" onClick={() => setStep("selection")}>
                      Continue to Selection
                    </Button>
                  </div>
                </div>
              )}

              {step === "selection" && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Step 2</h4>
                    <h3 className="text-2xl font-bold">Select Your Profile</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-auto">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent hover:border-white transition-all focus:outline-none"
                      >
                        <img 
                          src={model.src} 
                          alt={model.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                          <p className="text-sm font-bold">{model.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-[3px] border-zinc-900 rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-[3px] border-zinc-900 rounded-full"></div>
                    <div className="absolute inset-4 border-[3px] border-b-zinc-500 border-r-transparent border-t-transparent border-l-transparent rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-white animate-pulse" />
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold">Analyzing...</h3>
                    <div className="flex flex-col space-y-1">
                      <p className="text-zinc-500 text-xs uppercase tracking-widest animate-pulse">Working</p>
                      <p className="text-zinc-400 text-sm">Starting AI Render Engine</p>
                    </div>
                  </div>
                </div>
              )}

              {step === "result" && (
                <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-700">
                  <div className="flex-1 rounded-2xl overflow-hidden bg-zinc-900/30 border border-zinc-800 relative shadow-2xl">
                    <img 
                      src={resultImage || product.imageSrc} 
                      alt="Try-on Result"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.imageSrc;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Render Complete</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button variant="outline" className="w-full py-6 rounded-xl border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white" onClick={() => setIsTryOnOpen(false)}>
                      Close Mirror
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
