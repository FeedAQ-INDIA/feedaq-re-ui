// app/signin/page.jsx



import AgentSearchPage from "@/app/consultant/search/_components/AgentSearchPage";

export default function Page({ searchParams }) {

    const reference = searchParams?.reference || null;
     return <AgentSearchPage reference={reference} />;
}
