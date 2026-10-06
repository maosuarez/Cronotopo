"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { eras } from "@/data/index";
import type { HistoricalEra, MacroPeriod } from "@/domain/types";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { UI_MOTION } from "@/lib/motionTokens";
import { formatYearRange } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";
import { ChromeIn } from "./ChromeIn";
import { macroPeriodLabels, macroPeriodShortLabels } from "./categoryMeta";
import { pad2 } from "./format";

type Group = { period: MacroPeriod; eras: HistoricalEra[] };

/** Eras arrive sorted by order; consecutive eras with the same macroPeriod form a group. */
const groups: Group[] = eras.reduce<Group[]>((acc, era) => {
  const last = acc[acc.length - 1];
  if (last && last.period === era.macroPeriod) last.eras.push(era);
  else acc.push({ period: era.macroPeriod, eras: [era] });
  return acc;
}, []);

const optionId = (eraId: string) => `era-opt-${eraId}`;
const rangeOf = (era: HistoricalEra) => formatYearRange(era.startYear, era.endYear, era.rangeLabel);

export function Timeline() {
  const activeId = useAtlasStore((s) => s.activeEraId);
  const setEra = useAtlasStore((s) => s.setEra);
  const hasSelection = useAtlasStore((s) => s.selectedLocationId !== null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  const [cursor, setCursor] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const cursorId = cursor ?? activeId;
  const captionId = hoverId ?? (focused ? cursorId : activeId);
  const captionEra = eras.find((e) => e.id === captionId) ?? eras[0];
  const activeGroup = eras.find((e) => e.id === activeId)?.macroPeriod;

  // Keep the cursor visible in the horizontally scrolling rail.
  useLayoutEffect(() => {
    const node = listRef.current?.querySelector(`[data-era-id="${cursorId}"]`);
    node?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced || !mounted.current ? "auto" : "smooth",
    });
    mounted.current = true;
  }, [cursorId, reduced]);

  // Caption sits over its node (desktop) or at the centre (mobile), clamped to the page edges.
  useLayoutEffect(() => {
    const caption = captionRef.current;
    if (!caption) return;
    const edge = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--edge")) || 16;
    const vw = document.documentElement.clientWidth;
    const node = listRef.current?.querySelector(`[data-era-id="${captionId}"]`);
    const rect = node?.getBoundingClientRect();
    const centre = isDesktop && rect ? rect.left + rect.width / 2 : vw / 2;
    const width = caption.offsetWidth;
    caption.style.left = `${Math.max(edge, Math.min(centre - width / 2, vw - edge - width))}px`;
  }, [captionId, isDesktop]);

  const move = (toIndex: number) => {
    const target = eras[Math.max(0, Math.min(eras.length - 1, toIndex))];
    setCursor(target.id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = eras.findIndex((x) => x.id === cursorId);
    const groupIndex = groups.findIndex((g) => g.eras.some((x) => x.id === cursorId));
    const firstOfGroup = (g: number) => eras.indexOf(groups[Math.max(0, Math.min(groups.length - 1, g))].eras[0]);
    switch (e.key) {
      case "ArrowRight":
        move(index + 1);
        break;
      case "ArrowLeft":
        move(index - 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(eras.length - 1);
        break;
      case "PageDown":
        move(firstOfGroup(groupIndex + 1));
        break;
      case "PageUp": {
        const start = firstOfGroup(groupIndex);
        move(start < index ? start : firstOfGroup(groupIndex - 1));
        break;
      }
      case "Enter":
      case " ":
        setEra(cursorId);
        break;
      case "Escape":
        e.preventDefault();
        setCursor(null);
        return;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <ChromeIn
      order={1}
      tucked={hasSelection && !isDesktop}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-(--z-chrome) flex h-(--timeline-total) flex-col justify-end bg-[linear-gradient(to_top,#05060a_0%,#05060acc_55%,transparent)] pb-4"
    >
      <div aria-hidden className="relative z-(--z-caption) h-7 shrink-0">
        <div
          ref={captionRef}
          key={captionEra.id}
          className="absolute top-0 flex items-baseline gap-2 whitespace-nowrap"
          style={{ animation: `fade-in ${UI_MOTION.captionFade}s linear` }}
        >
          <span className="font-serif text-lead text-ink">{captionEra.name}</span>
          <span className="text-label text-muted tabular-nums">· {rangeOf(captionEra)}</span>
        </div>
      </div>
      <div
        ref={listRef}
        id="timeline-list"
        data-testid="timeline"
        role="listbox"
        aria-label="Línea de tiempo de eras"
        aria-orientation="horizontal"
        aria-activedescendant={optionId(cursorId)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setCursor(null);
        }}
        className="no-scrollbar timeline-mask pointer-events-auto flex snap-x snap-mandatory overflow-x-auto px-[calc(50%_-_var(--pitch)/2)] outline-none lg:snap-none lg:justify-center lg:overflow-visible lg:px-0"
      >
        <div className="flex w-max gap-6">
          {groups.map((group) => {
            const label = macroPeriodLabels[group.period];
            return (
              <div key={group.period} role="group" aria-label={label} className="flex flex-col">
                <div className="flex h-7 w-0 min-w-full items-center gap-2 lg:h-4">
                  <span
                    title={label}
                    className={`text-label sticky left-(--edge) min-w-0 leading-[1.2] tracking-[0.12em] uppercase max-lg:line-clamp-2 max-lg:tracking-[0.06em] lg:static ${group.eras.length <= 2 ? "lg:overflow-visible lg:whitespace-nowrap" : "lg:truncate"} ${group.period === activeGroup ? "text-ink" : "text-muted"}`}
                  >
                    {group.eras.length <= 2 ? macroPeriodShortLabels[group.period] : label}
                  </span>
                  <span aria-hidden className="h-px min-w-3 flex-1 bg-border max-lg:hidden" />
                </div>
                <div className="relative flex">
                  <span aria-hidden className="absolute inset-x-0 top-[17px] h-px bg-border-strong" />
                  {group.eras.map((era) => (
                    <div
                      key={era.id}
                      id={optionId(era.id)}
                      role="option"
                      aria-selected={era.id === activeId}
                      aria-label={`Era ${era.order}: ${era.name}, ${rangeOf(era)}`}
                      data-era-id={era.id}
                      data-active={era.id === activeId}
                      data-cursor={focused && era.id === cursorId}
                      data-hover={era.id === hoverId}
                      onClick={() => setEra(era.id)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHoverId(era.id)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && setHoverId(null)}
                      className="group relative flex h-11 w-(--pitch) shrink-0 cursor-pointer snap-center flex-col items-center pt-3"
                    >
                      <span className="relative grid size-[11px] place-items-center">
                        <span
                          aria-hidden
                          className="absolute -inset-1 rounded-full border border-accent-line opacity-0 transition-opacity duration-200 ease-settle group-data-[active=true]:opacity-100"
                        />
                        <span
                          aria-hidden
                          className="absolute -inset-2 rounded-full outline-2 outline-ink opacity-0 group-data-[cursor=true]:opacity-100"
                        />
                        <span
                          aria-hidden
                          className="size-[11px] scale-[0.64] rounded-full bg-muted transition-[transform,background-color] duration-200 ease-settle group-data-[active=true]:scale-100 group-data-[active=true]:bg-accent group-data-[cursor=true]:scale-[0.82] group-data-[cursor=true]:bg-ink group-data-[hover=true]:scale-[0.82] group-data-[hover=true]:bg-ink group-data-[active=true]:group-data-[cursor=true]:bg-accent group-data-[active=true]:group-data-[hover=true]:bg-accent"
                        />
                      </span>
                      <span
                        aria-hidden
                        className="text-label mt-1 text-muted tabular-nums transition-colors duration-200 group-data-[active=true]:text-accent"
                      >
                        {pad2(era.order)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChromeIn>
  );
}
