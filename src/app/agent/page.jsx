// app/signin/page.jsx


 import AgentSearchPage from "@/app/agent/_components/AgentSearchPage";

export default function Page({ searchParams }) {

    const reference = searchParams?.reference || null;
     return <AgentSearchPage reference={reference} />;
}
