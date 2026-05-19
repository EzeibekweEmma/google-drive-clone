import { useRouter } from "next/router";
import React from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { BsArrowLeftCircle } from "react-icons/bs";

type BreadcrumbItem = {
  id: string;
  label: string;
};

function FileHeader({
  headerName,
  breadcrumbs,
}: {
  headerName: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const router = useRouter();
  const isNestedFolder = router.route === "/drive/[...Folder]";
  const breadcrumbTrail =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ id: "", label: headerName }];

  return (
    <div className="flex flex-col space-y-6 p-5 pb-2">
      <div className="flex items-center space-x-2 text-2xl text-textC">
        {isNestedFolder && (
          <BsArrowLeftCircle
            className="h-6 w-6 cursor-pointer"
            onClick={() => router.back()}
          />
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {breadcrumbTrail.map((item, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            const route = item.id ? `/drive/folders/${item.id}` : "/drive/my-drive";

            return (
              <React.Fragment key={`${item.id}-${item.label}`}>
                {index > 0 && <span className="text-lg text-textC/60">/</span>}
                {isLast ? (
                  <h2>{item.label}</h2>
                ) : (
                  <button
                    onClick={() => router.push(route)}
                    className="transition hover:text-blue-600"
                  >
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Type</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>People</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Modified</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default FileHeader;
