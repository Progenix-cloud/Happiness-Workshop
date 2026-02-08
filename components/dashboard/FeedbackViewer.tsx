'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface FeedbackViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: IWorkshop | null;
}

export function FeedbackViewer({
  open,
  onOpenChange,
  workshop,
}: FeedbackViewerProps) {
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const feedbackComments = workshop?.feedbackComments || [];

  const sortedFeedback = [...feedbackComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const avgRating = feedbackComments.length > 0
    ? (feedbackComments.reduce((sum, f) => sum + f.rating, 0) / feedbackComments.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: feedbackComments.filter((f) => f.rating === 5).length,
    4: feedbackComments.filter((f) => f.rating === 4).length,
    3: feedbackComments.filter((f) => f.rating === 3).length,
    2: feedbackComments.filter((f) => f.rating === 2).length,
    1: feedbackComments.filter((f) => f.rating === 1).length,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const downloadFeedbackReport = () => {
    const report = `
FEEDBACK REPORT - ${workshop?.title}
Generated: ${new Date().toLocaleDateString()}

STATISTICS
==========
Average Rating: ${avgRating} / 5
Total Feedback: ${feedbackComments.length}

Rating Distribution:
5 Stars: ${ratingDistribution[5]}
4 Stars: ${ratingDistribution[4]}
3 Stars: ${ratingDistribution[3]}
2 Stars: ${ratingDistribution[2]}
1 Star: ${ratingDistribution[1]}

FEEDBACK COMMENTS
=================
${sortedFeedback
  .map(
    (f) => `
Name: ${f.userName}
Rating: ${f.rating} / 5
Date: ${new Date(f.createdAt).toLocaleDateString()}

Comment:
${f.comment}

---`,
  )
  .join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workshop?.title}-feedback-report.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Feedback & Reviews</DialogTitle>
          <DialogDescription>{workshop?.title}</DialogDescription>
        </DialogHeader>

        {feedbackComments.length > 0 ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {avgRating}
                </div>
                <div className="mb-2">{renderStars(Math.round(Number(avgRating)))}</div>
                <p className="text-sm text-gray-600">
                  Based on {feedbackComments.length} reviews
                </p>
              </Card>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-gray-600">
                      {stars} ★ ({ratingDistribution[stars as keyof typeof ratingDistribution]})
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${
                            feedbackComments.length > 0
                              ? (ratingDistribution[stars as keyof typeof ratingDistribution] /
                                  feedbackComments.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort & Export */}
            <div className="flex gap-2 pb-3 border-b">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              <Button
                onClick={downloadFeedbackReport}
                className="bg-blue-600 hover:bg-blue-700 ml-auto"
              >
                📄 Download Report
              </Button>
            </div>

            {/* Feedback Comments */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {sortedFeedback.map((feedback, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {feedback.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feedback.comment}
                  </p>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">No feedback yet</p>
              <p className="text-sm">Feedback will appear here once participants submit reviews</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
