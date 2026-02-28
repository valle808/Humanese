import { TopNav } from '@/components/TopNav';
import { HeroGradient } from '@/components/HeroGradient';
import { SearchBar } from '@/components/SearchBar';

export default function HpediaPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNav onSearch={() => {}} isLoading={false} showSearch={true} />
      <div className="relative flex-1">
        {/* Social Buttons - Top Right */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Add any social buttons here if needed */}
        </div>
        {/* Grain Gradient - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
          <HeroGradient />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight leading-[0.9] tracking-tight">
            <span className="block">Search anything.</span>
            <span className="block">Find the truth.</span>
          </h1>
          <div className="mt-10 w-full max-w-3xl mb-4">
            <SearchBar onSearch={() => {}} isLoading={false} variant="hero" />
          </div>
        </div>
      </div>
    </div>
  );
}
