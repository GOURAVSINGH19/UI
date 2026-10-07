"use client"

import { createPortal } from "react-dom"
import { Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { FilterMenu } from "./filter-menu"
import { Kbd, RotatingPlaceholder, SearchResults } from "./parts"
import { useSimpleSearch } from "./use-simple-search"
import type { SimpleSearchProps } from "./types"

export function SimpleSearch({
  items,
  onSelect,
  hotkey = "k",
  open,
  onOpenChange,
  showTrigger = true,
  showFilter = true,
  onFilterChange,
  label = "Search",
  inputProps,
  triggerClassName,
}: SimpleSearchProps) {
  const s = useSimpleSearch({ items, onSelect, hotkey, open, onOpenChange, onFilterChange })

  return (
    <>
      {showTrigger && (
        <button
          ref={s.triggerRef}
          type="button"
          onClick={() => s.setOpen(true)}
          aria-label={hotkey ? `${label} (${s.isMac ? "⌘" : "Ctrl"}+${hotkey.toUpperCase()})` : label}
          aria-haspopup="dialog"
          data-slot="search-trigger"
          className={cn("btn btn-secondary h-7 gap-1.5 px-2 text-ui-caption", triggerClassName)}
        >
          <Search className="size-3.5" />
          {hotkey && (
            <>
              <Kbd className="hidden sm:inline">{s.isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="hidden sm:inline">{hotkey.toUpperCase()}</Kbd>
            </>
          )}
        </button>
      )}

      {s.mounted &&
        s.open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <div
              aria-hidden
              onClick={s.close}
              className="absolute inset-0 bg-ui-bg/40 backdrop-blur-[3px] animate-in fade-in-0 duration-150"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={label}
              className="absolute top-[18vh] left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-ui-border bg-ui-bg text-sm shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <Search className="size-4 shrink-0 text-ui-caption" />
                <div className="relative flex min-w-0 flex-1">
                  {!s.query && <RotatingPlaceholder words={s.placeholderWords} />}
                  <input
                    ref={s.inputRef}
                    {...inputProps}
                    value={s.query}
                    onChange={(e) => {
                      s.setQuery(e.target.value)
                      s.setActive(0)
                    }}
                    onKeyDown={s.onInputKey}
                    aria-label={label}
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={s.listId}
                    aria-activedescendant={s.results.length ? `${s.listId}-${s.active}` : undefined}
                    autoComplete="off"
                    spellCheck={false}
                    className="relative w-0 flex-1 bg-transparent text-base text-ui-heading outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={s.close}
                  data-slot="search-close"
                  className="cursor-pointer rounded-md border border-ui-border px-1.5 py-0.5 text-[10px] font-medium text-ui-caption transition-colors hover:text-ui-heading"
                >
                  ESC
                </button>
              </div>

              <div
                key={s.filter}
                id={s.listId}
                role="listbox"
                aria-label="Results"
                data-lenis-prevent
                className="max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain border-t border-ui-border-subtle p-1.5"
              >
                <SearchResults
                  groups={s.groups}
                  query={s.q}
                  listId={s.listId}
                  active={s.active}
                  itemRefs={s.itemRefs}
                  onHover={s.setActive}
                  onChoose={s.choose}
                />
              </div>

              <div className="flex items-center justify-between border-t border-ui-border-subtle px-2.5 py-2 text-xs text-ui-caption">
                {showFilter ? <FilterMenu value={s.filter} options={s.filters} onChange={s.changeFilter} /> : <span />}
                <span className="hidden items-center gap-1.5 sm:flex">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> to move
                  <Kbd className="ml-2">↵</Kbd> to open
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
