"use client";
import React, { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Calendar,
    Clock,
    User,
    List,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

const SortableWidget = ({
    children,
    id,
    className,
}: {
    children: React.ReactNode;
    id: string;
    className: string;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={className}
        >
            {children}
        </div>
    );
};

const Widget = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`bg-white p-4 rounded-lg shadow ${className} cursor-move h-full`}
    >
        {children}
    </div>
);

const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
];

const trafficData = [
    { name: "Mon", visitors: 4000, pageViews: 2400 },
    { name: "Tue", visitors: 3000, pageViews: 1398 },
    { name: "Wed", visitors: 2000, pageViews: 9800 },
    { name: "Thu", visitors: 2780, pageViews: 3908 },
    { name: "Fri", visitors: 1890, pageViews: 4800 },
    { name: "Sat", visitors: 2390, pageViews: 3800 },
    { name: "Sun", visitors: 3490, pageViews: 4300 },
];

const productData = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 300 },
    { name: "Product D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const widgetContent = [
    {
        id: "sales",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Widget>
        ),
        className: "col-span-2 row-span-2",
    },
    {
        id: "stats",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <User className="w-6 h-6 mr-2 text-blue-500" />
                        <span>1,234 Users</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-6 h-6 mr-2 text-green-500" />
                        <span>4.5 hrs Avg. Session</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-red-500" />
                        <span>Next meeting: 2:00 PM</span>
                    </div>
                    <div className="flex items-center">
                        <ShoppingCart className="w-6 h-6 mr-2 text-purple-500" />
                        <span>56 New Orders</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="w-6 h-6 mr-2 text-yellow-500" />
                        <span>Revenue: $12,345</span>
                    </div>
                </div>
            </Widget>
        ),
        className: "col-span-1 row-span-2",
    },
    {
        id: "todo",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">Todo List</h2>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Prepare weekly report</span>
                    </li>
                    <li className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Call with client</span>
                    </li>
                    <li className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Review project proposal</span>
                    </li>
                    <li className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Update product roadmap</span>
                    </li>
                    <li className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Prepare Q3 budget</span>
                    </li>
                </ul>
            </Widget>
        ),
        className: "col-span-1 row-span-1",
    },
    {
        id: "activity",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-gray-500" />
                        <span>User John Doe logged in</span>
                    </li>
                    <li className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-gray-500" />
                        <span>New order #1234 received</span>
                    </li>
                    <li className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Product X is out of stock</span>
                    </li>
                    <li className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-gray-500" />
                        <span>New comment on blog post</span>
                    </li>
                    <li className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-gray-500" />
                        <span>User Jane Smith upgraded plan</span>
                    </li>
                </ul>
            </Widget>
        ),
        className: "col-span-1 row-span-1",
    },
    {
        id: "traffic",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">Website Traffic</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Widget>
        ),
        className: "col-span-2 row-span-2",
    },
    {
        id: "products",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">
                    Product Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {productData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Widget>
        ),
        className: "col-span-1 row-span-2",
    },
    {
        id: "alerts",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
                <ul className="space-y-2">
                    <li className="flex items-center text-yellow-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Server load high (85%)</span>
                    </li>
                    <li className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Database backup failed</span>
                    </li>
                    <li className="flex items-center text-green-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>SSL certificate renewed</span>
                    </li>
                </ul>
            </Widget>
        ),
        className: "col-span-1 row-span-1",
    },
    {
        id: "performance",
        content: (
            <Widget>
                <h2 className="text-xl font-semibold mb-4">
                    Performance Metrics
                </h2>
                <div className="space-y-4">
                    <div>
                        <span className="font-semibold">CPU Usage:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: "45%" }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">Memory Usage:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                            <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: "70%" }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">Disk I/O:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                            <div
                                className="bg-yellow-600 h-2.5 rounded-full"
                                style={{ width: "30%" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </Widget>
        ),
        className: "col-span-1 row-span-1",
    },
];
export default function Home() {
    const [widgets, setWidgets] = useState(widgetContent);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: { active: any; over: any }) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setWidgets((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={widgets.map((w) => w.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-4 auto-rows-fr gap-8">
                        {widgets.map((widget) => (
                            <SortableWidget
                                key={widget.id}
                                id={widget.id}
                                className={widget.className}
                            >
                                {widget.content}
                            </SortableWidget>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
