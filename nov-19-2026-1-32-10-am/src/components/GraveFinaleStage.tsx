import React, { useState } from 'react';
import { soundFX } from '../game/soundEffects';
import { AnimatedDedaenaBook, AnimatedGraveScene } from './AnimatedScenes';

type FinaleStep =
  | 'point_violet'
  | 'say_ai_ia'
  | 'spirit_rises'
  | 'dedaena_gift'
  | 'dedaena_story';

interface GraveFinaleStageProps {
  onFinish: () => void;
}

export const GraveFinaleStage: React.FC<GraveFinaleStageProps> = ({
  onFinish,
}) => {
  const [step, setStep] = useState<FinaleStep>('point_violet');

  const handlePointAtViolet = () => {
    soundFX.playAiIaReveal();
    setStep('say_ai_ia');
  };

  const handleSummonSpirit = () => {
    soundFX.playBellChime();
    setStep('spirit_rises');
  };

  const handleRevealBook = () => {
    soundFX.playPageTurn();
    setStep('dedaena_gift');
  };

  const handleAcceptDedaena = () => {
    soundFX.playDedaenaGift();
    setStep('dedaena_story');
  };

  const handleCompleteGame = () => {
    soundFX.playBellChime();
    onFinish();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 pt-24 pb-10 sm:px-10">
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left: Interactive 2D Animated Mtatsminda Grave, Violet & Rising Spirit */}
        <section className="relative overflow-hidden rounded-2xl border border-[#D4A34A]/30 bg-[#141921] p-2 shadow-2xl lg:col-span-7">
          <AnimatedGraveScene step={step} onVioletClick={handlePointAtViolet} />
        </section>

        {/* Right Panel: Narrative Progression & Ceremonial Dedaena Handover */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#2C3440] bg-[#1A2029] p-6 sm:p-8 lg:col-span-5">
          {step === 'point_violet' && (
            <div>
              <p className="text-xs font-medium text-[#A78BFA]">
                ფინალი · მთაწმინდის პანთეონი
              </p>
              <h1
                className="mt-3 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                ია იაკობის საფლავზე
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#D8D2C7]">
                ლაბირინთის ბოლოს იაკობ გოგებაშვილის საფლავს მიადექი. მის ძირას
                ნორჩი იისფერი ია ამოსულა. მიანიშნე თითი ყვავილს და წარმოთქვი
                უკვდავი სიტყვები!
              </p>

              <button
                type="button"
                onClick={handlePointAtViolet}
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#6D28D9]"
              >
                <span>თითის მინიშნება იაზე — „აი-ია“</span>
              </button>
            </div>
          )}

          {step === 'say_ai_ia' && (
            <div>
              <p className="text-xs font-medium text-[#A78BFA]">
                პირველი სიტყვა
              </p>
              <h1
                className="mt-3 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                „აი-ია“ გაისმა მთაწმინდაზე
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#D8D2C7]">
                როგორც კი მშობლიური სიტყვა წარმოთქვი, საფლავის ქვას თბილი
                ოქროსფერი ნათება მოეფინა. იაკობ გოგებაშვილის სული შენს
                დასალოცად ამოდის.
              </p>

              <button
                type="button"
                onClick={handleSummonSpirit}
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-3 text-base font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E]"
              >
                <span>იაკობის სულთან შეხვედრა</span>
              </button>
            </div>
          )}

          {step === 'spirit_rises' && (
            <div>
              <p className="text-xs font-medium text-[#D4A34A]">
                იაკობის დალოცვა
              </p>
              <h1
                className="mt-3 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ქართული სიტყვის მცველს
              </h1>
              <blockquote className="mt-4 rounded-xl border border-[#D4A34A]/30 bg-[#141921] p-5 text-base italic leading-relaxed text-[#F4EFE4]">
                „გმადლობ, შვილო, რომ არ დაივიწყე ჩემი გზა და „აი-ია“ კვლავ
                გააცოცხლე. სანამ ქართული ენა ჟღერს, საქართველო უკვდავია.
                მიიღე ჩემგან საგანძური — „დედა ენა“!“
              </blockquote>

              <button
                type="button"
                onClick={handleRevealBook}
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-3 text-base font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E]"
              >
                <span>დედაენის გადმოცემა</span>
              </button>
            </div>
          )}

          {step === 'dedaena_gift' && (
            <div>
              <p className="text-xs font-medium text-[#D4A34A]">
                საჩუქარი იაკობისგან
              </p>
              <h1
                className="mt-2 text-2xl font-bold text-[#F4EFE4]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                „დედა ენა“ შენს ხელშია
              </h1>

              <div className="mt-4 overflow-hidden rounded-xl border border-[#D4A34A]/40 bg-[#141921]">
                <AnimatedDedaenaBook />
              </div>

              <button
                type="button"
                onClick={handleAcceptDedaena}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-3 text-base font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E]"
              >
                <span>დედაენის მიღება</span>
              </button>
            </div>
          )}

          {step === 'dedaena_story' && (
            <div>
              <p className="text-xs font-medium text-[#D4A34A]">
                დედაენა მიღებულია · საუნჯის გზა
              </p>
              <h1
                className="mt-2 text-2xl font-bold text-[#F4EFE4] sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ამბავი დედაენისა
              </h1>

              {/* Framed concise Dedaena Story Card */}
              <div
                aria-label="ამბავი დედაენისა"
                className="mt-4 rounded-xl border-2 border-[#D4A34A]/65 bg-[#141921] p-5 shadow-inner ring-1 ring-[#D4A34A]/20"
              >
                <p className="text-sm font-semibold text-[#F3C96B]">
                  1876 წელი · „აი ია“-დან უკვდავებამდე
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#EAE5DB] sm:text-base">
                  1876 წელს იაკობ გოგებაშვილმა შექმნა „დედა ენა“ — ქართველი
                  ბავშვების პირველი სახელმძღვანელო, რომელმაც თაობებს „აი ია“-თი
                  გაუღო ცოდნის კარი.
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#C9C3B8]">
                  მშობლიური სიტყვისა და ანბანის სიყვარულით შექმნილი ეს პატარა
                  წიგნი უკვე საუკუნე-ნახევარია ქართული სულიერების მთავარ
                  საძირკვლად რჩება.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCompleteGame}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A34A] px-5 py-3 text-base font-semibold text-[#12161C] transition-colors hover:bg-[#E0B35E]"
              >
                <span>თამაშის დასრულება</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
