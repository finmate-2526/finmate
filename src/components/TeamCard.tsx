import { Button } from '@/components/ui/button';
import { Instagram, Linkedin } from 'lucide-react';

export type TeamCardProps = {
  name: string;
  role: string;
  imgSrc?: string; // optional: leave empty and you can add later
  linkedinUrl?: string;
  instagramUrl?: string;
  className?: string;
};

export function TeamCard({ name, role, imgSrc, linkedinUrl, instagramUrl, className = '' }: TeamCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const IconBtn = ({ url, children, label }: { url?: string; children: React.ReactNode; label: string }) => {
    const disabled = !url;
    const content = (
      <Button
        variant="secondary"
        size="icon"
        className={`h-8 w-8 rounded-full bg-white/90 text-black hover:bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={label}
      >
        {children}
      </Button>
    );
    if (disabled) return <span aria-disabled className="select-none">{content}</span>;
    return (
      <a href={url} target="_blank" rel="noreferrer noopener">
        {content}
      </a>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-gray-800 bg-[#0f0f0f] shadow-sm group ${className}`}>
      {/* Image / placeholder */}
      <div className="w-full aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900">
        {imgSrc ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img src={imgSrc} alt={name} className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-[1.02]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-slate-400 transition-all duration-300 group-hover:blur-sm group-hover:scale-[1.02]">
            {initials}
          </div>
        )}
      </div>

      {/* Bottom gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Name pill */}
      <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-white text-black rounded-2xl px-4 py-2 shadow">
          <div className="text-sm sm:text-base font-semibold leading-tight">{name}</div>
          <div className="text-[10px] sm:text-xs text-neutral-600 leading-none mt-1">{role}</div>
        </div>
        <div className="flex items-center gap-2">
          <IconBtn url={linkedinUrl} label={`LinkedIn - ${name}`}>
            <Linkedin className="h-4 w-4" />
          </IconBtn>
          <IconBtn url={instagramUrl} label={`Instagram - ${name}`}>
            <Instagram className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}
