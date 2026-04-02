import Breadcrumb from "@/components/molecules/Breadcrumb";

interface PageHeaderProps {
  breadcrumbText: string;
  titleEn: string;
  titleCh: string;
  link?: string;
}

const PageHeader = ({
  breadcrumbText,
  titleEn,
  titleCh,
  link,
}: PageHeaderProps) => {
  const pathUrl = link || titleEn.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative flex-center flex-col w-full min-h-40 bg-primary py-8">
      <div className="absolute top-4 left-5 md:left-8">
        <Breadcrumb
          textColor="text-white"
          link={pathUrl}
          text={breadcrumbText}
        />
      </div>
      <h1 className="flex flex-col items-center gap-y-2 text-white">
        <span className="text-lg font-light tracking-wider">{titleEn}</span>
        <span className="text-2xl font-medium">{titleCh}</span>
      </h1>
    </div>
  );
};

export default PageHeader;
