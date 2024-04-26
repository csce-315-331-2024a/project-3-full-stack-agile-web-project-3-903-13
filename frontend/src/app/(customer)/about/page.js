import React from 'react';
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8">About Rev&apos;s American Grill</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="md:order-2">
                        <Image src="/revs-restaurant-image.jpg" alt="Rev's American Grilled Restaurant" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="md:order-1">
                        <p className="text-lg mb-4">Welcome to Rev&apos;s American Grilled, located in the Memorial Student Center (MSC) at Texas A&M University!</p>
                        <p className="text-lg mb-4">We specialize in serving delicious American-style grilled dishes, featuring mouthwatering burgers, sandwiches, tenders,  and more.</p>
                        <p className="text-lg mb-4">Our restaurant offers a cozy and inviting atmosphere, perfect for enjoying a meal with friends and family.</p>
                        <p className="text-lg">Come visit us at the MSC and experience the taste of Rev&apos;s American Grilled!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
