import { ArrowUpRight, Github, Heart } from "lucide-react"

const REPO_URL = "https://github.com/GOURAVSINGH19/UI"

/** "Get started" row at the bottom of the home page; the whole row opens the repo. */
export function GithubCta() {
    return (
        <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <p className="eyebrow">Get started</p>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-ui-heading">
                    Free, open source, yours.
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ui-caption">
                    Grab the code on GitHub. If Uiin saves you some time, a star helps
                    other people find it.
                </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ui-border bg-ui-bg py-2 pr-3 pl-2.5 text-sm text-ui-strong transition-colors group-hover:border-ui-border-strong sm:self-auto">
                <Heart className="size-4 text-rose-500 transition-transform duration-300 group-hover:scale-110 group-hover:fill-rose-500" />
                <Github className="size-4" />
                Star on GitHub
                <ArrowUpRight className="size-3.5 text-ui-caption transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
        </a>
    )
}
