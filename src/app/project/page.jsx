// app/signin/page.jsx


import ProjectSearchPage from "@/app/project/_components/ProjectSearchPage";

export default function Page({ searchParams }) {

    const reference = searchParams?.reference || null;
     return <ProjectSearchPage reference={reference} />;
}
