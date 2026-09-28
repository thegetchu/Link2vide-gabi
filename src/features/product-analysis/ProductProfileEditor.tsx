import React, { useState } from 'react';
import { ArrowRight, Sparkles, Plus, Trash2, Check, ExternalLink, Image as ImageIcon, Palette, DollarSign, Tag, ArrowLeft } from 'lucide-react';
import { ProductProfile } from '../../types/adProject';

interface ProductProfileEditorProps {
  initialProfile: ProductProfile;
  onGenerateAd: (updatedProfile: ProductProfile) => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const ProductProfileEditor: React.FC<ProductProfileEditorProps> = ({
  initialProfile,
  onGenerateAd,
  onBack,
  isGenerating
}) => {
  const [profile, setProfile] = useState<ProductProfile>(JSON.parse(JSON.stringify(initialProfile)));
  const [newFeature, setNewFeature] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Field change handlers
  const handleProductNameChange = (val: string) => {
    setProfile(prev => ({
      ...prev,
      product: { ...prev.product, name: val }
    }));
  };

  const handleBrandNameChange = (val: string) => {
    setProfile(prev => ({
      ...prev,
      brand: { ...prev.brand, name: val }
    }));
  };

  const handlePriceChange = (val: number) => {
    setProfile(prev => ({
      ...prev,
      product: {
        ...prev.product,
        price: {
          value: val,
          currency: prev.product.price?.currency || 'USD',
          originalValue: prev.product.price?.originalValue,
          discountPercentage: prev.product.price?.discountPercentage
        }
      }
    }));
  };

  const handleDescriptionChange = (val: string) => {
    setProfile(prev => ({
      ...prev,
      product: { ...prev.product, description: val }
    }));
  };

  const handleCtaChange = (val: string) => {
    setProfile(prev => ({
      ...prev,
      product: { ...prev.product, cta: val }
    }));
  };

  const handleRemoveFeature = (idx: number) => {
    setProfile(prev => ({
      ...prev,
      product: {
        ...prev.product,
        features: prev.product.features.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setProfile(prev => ({
      ...prev,
      product: {
        ...prev.product,
        features: [...prev.product.features, newFeature.trim()]
      }
    }));
    setNewFeature('');
  };

  const handleColorChange = (idx: number, newColor: string) => {
    const updatedColors = [...(profile.brand.colors || ['#3B82F6', '#1E293B', '#FFFFFF', '#F59E0B'])];
    updatedColors[idx] = newColor;
    setProfile(prev => ({
      ...prev,
      brand: { ...prev.brand, colors: updatedColors }
    }));
  };

  const images = profile.assets.productImages || [];
  const activeImage = images[selectedImageIdx] || images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to URL input</span>
          </button>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Product Intelligence
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Review and adjust extracted product data before triggering Wan 3.0 video generation.
          </p>
        </div>

        <button
          onClick={() => onGenerateAd(profile)}
          disabled={isGenerating || !profile.product.name.trim()}
          className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isGenerating ? 'Generating Video...' : 'Generate Ad'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Grid: Left Media & Brand / Right Details Editor */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (5 Cols): Product Image & Brand Assets */}
        <div className="space-y-6 lg:col-span-5">
          {/* Main Hero Product Image */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-xl">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950">
              <img
                src={activeImage}
                alt={profile.product.name}
                className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  // Fallback placeholder image
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-md">
                Wan 3.0 Visual Reference
              </div>
            </div>

            {/* Thumbnail selector if multiple images exist */}
            {images.length > 1 && (
              <div className="mt-3 flex space-x-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIdx === idx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detected Brand Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Brand Identity & Palette
            </h3>

            <div className="mt-4 flex items-center space-x-3">
              {profile.brand.logo?.url ? (
                <img
                  src={profile.brand.logo.url}
                  alt={profile.brand.name || 'Brand Logo'}
                  className="h-10 w-10 rounded-lg border border-slate-700 bg-slate-950 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-xs font-bold text-amber-400">
                  {profile.brand.name?.[0] || 'B'}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{profile.brand.name || 'Brand'}</p>
                <p className="text-xs text-slate-400">{profile.seller.name ? `Sold by ${profile.seller.name}` : 'Direct store'}</p>
              </div>
            </div>

            {/* Detected Colors */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-medium text-slate-300">Detected Color Tokens</span>
              <div className="mt-2 flex items-center space-x-3">
                {(profile.brand.colors || ['#D97706', '#1E293B', '#F8FAFC', '#78350F']).map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1">
                    <label className="relative cursor-pointer">
                      <input
                        type="color"
                        value={col}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className="h-7 w-7 rounded-full border border-white/20 shadow-md transition-transform hover:scale-110"
                        style={{ backgroundColor: col }}
                      />
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{col}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Reference Link */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[200px]">{profile.sourceUrl}</span>
              <a
                href={profile.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
              >
                <span>Original Page</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Editable Product Intelligence */}
        <div className="space-y-5 lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Name
              </label>
              <input
                type="text"
                value={profile.product.name}
                onChange={(e) => handleProductNameChange(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Brand Name & Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={profile.brand.name || ''}
                  onChange={(e) => handleBrandNameChange(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Price ({profile.product.price?.currency || 'USD'})
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    value={profile.product.price?.value ?? 99}
                    onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm font-semibold text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Description
              </label>
              <textarea
                rows={3}
                value={profile.product.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs leading-relaxed text-slate-200 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Features List */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Features (Used for Wan 3.0 prompt & Text Overlays)
              </label>
              <div className="mt-2 space-y-2">
                {profile.product.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove feature"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Feature input */}
              <div className="mt-2.5 flex space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Add custom feature (e.g. 40 grind settings)..."
                  className="block flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Call to Action button label */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Call to Action (CTA)
              </label>
              <input
                type="text"
                value={profile.product.cta || 'Shop Now'}
                onChange={(e) => handleCtaChange(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm font-semibold text-amber-400 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Ready to generate commercial video with Wan 3.0?
            </span>
            <button
              onClick={() => onGenerateAd(profile)}
              disabled={isGenerating || !profile.product.name.trim()}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Generating Video...' : 'Generate Ad'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
