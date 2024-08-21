"use client";
import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Calendar, Clock, User, List } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
];

const SortableWidget = ({
    children,
    id,
}: {
    children: React.ReactNode;
    id: string;
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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
    <div className={`bg-white p-4 rounded-lg shadow ${className} cursor-move`}>
        {children}
    </div>
);

const widgetContent = [
    {
        id: "sales",
        content: (
            <Widget className="col-span-2">
                <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
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
                </div>
            </Widget>
        ),
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
                </ul>
            </Widget>
        ),
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
                </ul>
            </Widget>
        ),
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-8">
                        {widgets.map((widget) => (
                            <SortableWidget key={widget.id} id={widget.id}>
                                {widget.content}
                            </SortableWidget>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
