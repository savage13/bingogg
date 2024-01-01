import { useApi } from '@/lib/Hooks';
import { Goal } from '@/types/Goal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import GoalEditor from './GoalEditor';

interface GoalManagementParams {
    slug: string;
}

export default function GoalManagement({ slug }: GoalManagementParams) {
    const {
        data: goals,
        isLoading: goalsLoading,
        mutate: mutateGoals,
    } = useApi<Goal[]>(`http://localhost:8000/api/games/${slug}/goals`);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [newGoal, setNewGoal] = useState(false);

    const [catList, setCatList] = useState<{ label: string; value: string }[]>(
        [],
    );

    useEffect(() => {
        const cats: string[] = [];
        goals?.forEach((goal) => {
            if (goal.categories) {
                cats.push(
                    ...goal.categories.filter((cat) => !cats.includes(cat)),
                );
            }
        });
        setCatList(cats.map((cat) => ({ label: cat, value: cat })));
    }, [goals]);

    const deleteGoal = useCallback(
        async (id: string) => {
            const res = await fetch(`http://localhost:8000/api/goals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                //TODO: handle the error
                return;
            }
            mutateGoals();
        },
        [mutateGoals],
    );

    if (!goals || goalsLoading) {
        return null;
    }

    return (
        <div className="flex grow flex-col">
            <div className="text-center text-2xl">Goal Management</div>
            <div className="flex w-full grow gap-x-5">
                <div className="flex w-1/3 flex-col rounded-md border-2 border-white px-3">
                    <div className="h-px grow overflow-y-auto">
                        {goals.map((goal, index) => (
                            <div key={goal.id} className="border-b py-2">
                                <div
                                    className="group/item flex cursor-pointer items-center rounded-md px-2 py-1 hover:bg-gray-400 hover:bg-opacity-60"
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    {goal.goal}
                                    <div className="grow" />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="group/edit invisible rounded-full p-2.5 text-white hover:bg-black group-hover/item:visible"
                                        onClick={(e) => {
                                            deleteGoal(goal.id);
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="py-2">
                            <div
                                className="cursor-pointer rounded-md px-2 py-2 hover:bg-gray-400 hover:bg-opacity-60"
                                onClick={() => setNewGoal(true)}
                            >
                                New Goal
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grow text-center">
                    {!newGoal && goals[selectedIndex] && (
                        <GoalEditor
                            slug={slug}
                            goal={goals[selectedIndex]}
                            mutateGoals={mutateGoals}
                            categories={catList}
                        />
                    )}
                    {newGoal && (
                        <GoalEditor
                            slug={slug}
                            goal={{ id: '', goal: '', description: '' }}
                            isNew
                            cancelNew={() => setNewGoal(false)}
                            mutateGoals={mutateGoals}
                            categories={catList}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
