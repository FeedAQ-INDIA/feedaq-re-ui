// app/signin/page.jsx


import SearchPage from "@/app/property/_components/SearchPage";

export default function Page({ searchParams }) {

    const reference = searchParams?.reference || null;
     return <SearchPage reference={reference} />;
}
