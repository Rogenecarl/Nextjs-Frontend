import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, ClipboardCheck, FileText, HelpCircle, Hourglass, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { DocumentProps } from '@/types/types';

// Sample document data - in a real application, this would come from props or API
const documents = [
    { id: 1, name: 'Business License', status: 'pending' },
    { id: 2, name: 'Medical Certifications', status: 'approved' },
    { id: 3, name: 'Proof of Address', status: 'rejected' },
]

export default function ProviderProfilePending() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex w-full flex-col items-center">
            {/* Header */}
            <div className="mb-10 max-w-3xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-sky-300 to-indigo-300 shadow-lg">
                    <Hourglass className="h-8 w-8 text-white" />
                </div>

                <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                    <span className="bg-gradient-to-r from-sky-500 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Your Profile is Pending Approval
                    </span>
                </h1>

                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    Thank you for registering as a healthcare provider. Our team is currently reviewing your profile and documents.
                    This process typically takes 1-3 business days.
                </p>

                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <Badge className="bg-sky-100 px-3 py-1.5 text-sky-700 hover:bg-sky-100">
                        <Clock className="mr-2 h-4 w-4" />
                        Submitted ago
                    </Badge>
                    <Badge className="bg-indigo-100 px-3 py-1.5 text-indigo-700 hover:bg-indigo-100">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Verification in Progress
                    </Badge>
                </div>
            </div>

            {/* Status Card */}
            <div className="w-full max-w-4xl">
                <Card className="border-0 bg-gradient-to-r from-sky-50 to-indigo-50 shadow-md">
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                                    <ClipboardCheck className="h-5 w-5 text-sky-600" />
                                </div>
                                <h3 className="text-lg font-semibold">Verification Status</h3>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700">Pending</Badge>
                        </div>

                        <div className="mb-6">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium">Document Verification</span>
                                <span className="text-sm font-medium">%</span>
                            </div>
                            <Progress className="h-2" />
                        </div>

                        {/* Document Status */}
                        {documents.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <h4 className="font-medium">Document Status</h4>
                                <div className="rounded-lg border bg-white p-4">
                                    <ul className="space-y-3">
                                        {documents.map((doc) => (
                                            <li key={doc.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                    <span>{doc.name}</span>
                                                </div>
                                                <Badge
                                                    className={`${doc.status === 'approved'
                                                        ? 'bg-green-100 text-green-700'
                                                        : doc.status === 'rejected'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-sky-100 text-sky-700'
                                                        }`}
                                                >
                                                    {doc.status === 'approved' ? (
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                    ) : doc.status === 'rejected' ? (
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <Clock className="mr-1 h-3 w-3" />
                                                    )}
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* What to expect */}
                        <div className="rounded-lg border bg-white p-4">
                            <h4 className="mb-3 font-medium">What to expect next:</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start">
                                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                    <span>Our team will review your business information and credentials</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                    <span>We may contact you for additional information if needed</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                    <span>Once approved, you'll receive an email notification</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                    <span>Your profile will be visible to patients after approval</span>
                                </li>
                            </ul>
                        </div>

                        {/* Help Section */}
                        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-6 text-center">
                            <HelpCircle className="mb-2 h-8 w-8 text-indigo-500" />
                            <h4 className="mb-2 font-medium">Need assistance?</h4>
                            <p className="mb-4 text-sm text-gray-600">
                                If you have any questions about your application or need to update your information, our support team is here to help.
                            </p>
                            <Button
                                variant="outline"
                                className="border-sky-500 text-sky-700 hover:bg-sky-100"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Contact Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}