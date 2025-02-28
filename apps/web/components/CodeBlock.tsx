import { IconCheck, IconClipboard, IconDownload } from "@tabler/icons-react"
import { FC, memo, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight
} from "react-syntax-highlighter/dist/cjs/styles/prism"

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css"
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

interface Props {
  language: string
  value: string
}

// pulled from https://github.com/mckaywrigley/chatbot-ui/blob/main/utils/app/codeblock.ts
export const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (
    <div className="codeblock relative font-sans text-[16px] group">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs lowercase text-white">{language}</span>

        <div className="flex items-center">
          <button
            className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-white group-hover:text-black"
            onClick={copyToClipboard}>
            {isCopied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
            {isCopied ? "Copied!" : "Copy code"}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{ margin: 0 }}>
        {value}
      </SyntaxHighlighter>
    </div>
  )
})
CodeBlock.displayName = "CodeBlock"
