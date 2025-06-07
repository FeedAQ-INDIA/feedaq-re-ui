// app/signin/page.jsx

import SearchPage from "@/app/search/_components/SearchPage";

export default function Page({ searchParams }) {

    const reference = searchParams?.reference || null;
     return <SearchPage reference={reference} />;
}
