import React, { createContext,  useEffect,  useState } from 'react'


const Context = createContext()

export const FeedbackProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(true)

    const [feedback, setFeedback] = useState([])

    const [itemEdit, setItemEdit] = useState({
        item: {},
        edit: false,
    })

    useEffect(() => {
        fetchFeedback()
    }, [])

    //fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch(`/feedback?_sort=id&_order=desc`)
        const data = await response.json()
        setFeedback(data)
        setIsLoading(false)
    }
    //Add feedback to db.json
    const addFeedback = async (newFeedback) => {
        const response = await fetch('/feedback',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        })
        const data = await response.json()

        setFeedback([data, ...feedback])
    }

    //delete feedback
    const deleteFeedback = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await fetch(`/feedback/${id}`, {method: 'DELETE'})
            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updItem)
        })

        const data = await response.json()

        setFeedback(
            feedback.map((item) => (item.id === id ? 
                {...item, ...data} : item)))

    }

    //set item to be updated
    const editFeedback = (item) => {
        setItemEdit({
            item,
            edit:true
        })
    }


    return <Context.Provider value={{
        feedback,
        itemEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
    }}>
        {children}
    </Context.Provider>
}


export default Context