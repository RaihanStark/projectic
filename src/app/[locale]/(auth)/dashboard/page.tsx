import {
  ArrowDownUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default function Dashboard() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4" />
          <button type="button" className="rounded-md p-2 hover:bg-gray-100">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
          >
            <ArrowDownUp className="h-4 w-4" />
            <span>Sort</span>
          </button>
          <button type="button" className="rounded-md p-2 hover:bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>1 tasks</span>
          <div className="flex items-center">
            <button type="button" className="rounded-md p-2 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-md p-2 hover:bg-gray-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span>3/1/2024</span>
        </div>
      </div>
      <div>
        {/* Task Item */}
        <div className="flex items-center gap-4 border-b p-4 hover:bg-gray-50">
          <input type="checkbox" className="h-4 w-4" />
          <div className="grid flex-1 grid-cols-5 items-center gap-4">
            <div className="col-span-1 font-medium">refsdfsd</div>
            <div className="col-span-1 truncate text-gray-500">
              fsdfsdf...
            </div>
            <div className="col-span-1">
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                In Progress
              </span>
            </div>
            <div className="col-span-1">
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                High
              </span>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <span className="text-sm text-gray-500">0/1</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                sdfsdf
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                sdf
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
