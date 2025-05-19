import React, { useState, useEffect } from "react";

export default function GenerateReport(){

    const [error, setError] = useState(null);
    const [isLoadong, setIsLoading] = useState(false)
    const [reportAttribute, setReportAttribute] = useState([]);
    const [reportDate, setReportDate] = useState(null);
    const [reportType, setReportType] = useState('Daily');
    const [showDailyReport, setShowDailyReport] = useState(false);
    const [showWeeklyReport, setShowWeeklyReport] = useState(false);
    const [showMonthlyReport, setShowMonthlyReport] = useState(false);
    const [generatedReport, setGeneratedReport] = useState({});
    const [showGeneratedReport, setShowGeneratedReport] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [serviceListing, setServiceListing] = useState([]);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const months = [
        { value: '01', name: 'January' },
        { value: '02', name: 'February' },
        { value: '03', name: 'March' },
        { value: '04', name: 'April' },
        { value: '05', name: 'May' },
        { value: '06', name: 'June' },
        { value: '07', name: 'July' },
        { value: '08', name: 'August' },
        { value: '09', name: 'September' },
        { value: '10', name: 'October' },
        { value: '11', name: 'November' },
        { value: '12', name: 'December' }
    ];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    
    useEffect(() => {
        viewServiceListing();
        setShowDailyReport(true);
        setShowWeeklyReport(false);
        setShowMonthlyReport(false);
    }, [])

    useEffect(() => {
            if (reportType === "Daily" && selectedDay && selectedMonth && selectedYear) {
                setReportDate(`${selectedYear}-${selectedMonth}-${selectedDay.padStart(2, '0')}`);
            }

            if (reportType === "Weekly" && selectedDay && selectedMonth && selectedYear) {
                setReportDate(`${selectedYear}-${selectedMonth}-${selectedDay.padStart(2, '0')}`);
            }

            if (reportType === "Monthly" && selectedMonth && selectedYear) {
                setSelectedDay('01'); // Auto-set day
                setReportDate(`${selectedYear}-${selectedMonth}-01`);
            }
    }, [selectedDay,selectedMonth,selectedYear, reportType])

    const viewServiceListing = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/serviceListing`)
            
            const data = await response.json()

            setServiceListing(data);

        } catch (error) {
            console.log(error);
            setServiceListing([]);
        }
    }

    const generateDailyReport = async(e) => {
        e.preventDefault();
        setError('')
        setGeneratedReport({})
        setShowGeneratedReport(false);

        try {

            console.log(reportDate);
            const response = await fetch(`http://localhost:3000/api/platformReport/daily/`, {
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    date_of_report : reportDate
                })
            })

            if (!response.ok) {
                const errorData = await         response.json()
                throw new Error (errorData.message || 'Failed to generate report')
            }

            const data = await response.json()
            console.log(data)
            setGeneratedReport(data);
            setShowGeneratedReport(true);

        } catch (error) {
            
            setError(error.message)
        }

    }

    const generateWeeklyReport = async(e) => {
         e.preventDefault();
        setError('')
        setGeneratedReport({})
        setShowGeneratedReport(false);

        try {

            const response = await fetch(`http://localhost:3000/api/platformReport/weekly/`, {
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    date_of_report : reportDate
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error (errorData.message || 'Failed to generate report')
            }

            const data = await response.json()

            setGeneratedReport(data);
            setShowGeneratedReport(true);

        } catch (error) {
            
            setError(error.message)
        }
    }

    const generateMonthlyReport = async(e) => {
         e.preventDefault();
        setError('')
        setGeneratedReport({})
        setShowGeneratedReport(false);

        try {

            const response = await fetch(`http://localhost:3000/api/platformReport/monthly/`, {
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    date_of_report : reportDate
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error (errorData.message || 'Failed to generate report')
            }

            const data = await response.json()

            setGeneratedReport(data);
            setShowGeneratedReport(true);

        } catch (error) {
            
            setError(error.message)
        }
    }

    const getWeeklyDateRange = (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Adds 6 more days for a total of 7

        const format = (date) => date.toISOString().split('T')[0];
        return `${format(start)} to ${format(end)}`;
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setReportType(value)
        setShowGeneratedReport(false);

        setShowDailyReport(value === 'Daily');
        setShowWeeklyReport(value === 'Weekly');
        setShowMonthlyReport(value === 'Monthly');
         
    }


    const getServiceName = (id) => {
        const service = serviceListing.find(s => s.id === id);
        return service ? `${service.title}` : '';
    }

    const getTime = (time) => {
        const localDate = new Date(time);
        return localDate.toLocaleDateString('en-CA');
    }

    return(
        <>
        <h2>
            Generate Report
        </h2>
        <div>
            <select
                name="report type"
                value = {reportType}
                onChange={handleChange}
            >
                <option value="Daily">Daily Report</option>
                <option value="Weekly">Weekly Report</option>
                <option value="Monthly">Monthly Report</option>
            </select>

            {showDailyReport && (
                <div>
                <form onSubmit={generateDailyReport}>
                <label>Day:</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                    <option value="">--</option>
                            {days.map((day) => (
                                <option key={day} value={day.toString().padStart(2, '0')}>
                                    {day}
                    </option>
                    ))}
                </select>
                
                <label>Month:</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="">--</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                </select>

                <label>Year:</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">--</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                </select>
                <div>
                <button
                    className="search-buttons"
                    type="submit"
                >
                    Generate Report
                </button>
                </div>
                </form>
                </div>
            )}

            {showWeeklyReport && (
                <div>
                <form onSubmit={generateWeeklyReport}>
                <label>Day:</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                    <option value="">--</option>
                            {days.map((day) => (
                                <option key={day} value={day.toString().padStart(2, '0')}>
                                    {day}
                    </option>
                    ))}
                </select>
                
                <label>Month:</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="">--</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                </select>

                <label>Year:</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">--</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                </select>
                <button
                    className="search-buttons"
                    type="submit"
                >
                    Generate Report
                </button>
                </form>
                </div>
            )}

            {showMonthlyReport && (
                <div>
                <form onSubmit={generateMonthlyReport}>
                <label>Month:</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="">--</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                </select>

                <label>Year:</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">--</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                </select>
                <button
                    className="search-buttons"
                    type="submit"
                >
                    Generate Report
                </button>
                </form>
                </div>
            )}
            {error && <div className="error-message">{error}</div>} 

            {showGeneratedReport && generatedReport && (
                <div>
                    <h2>Report Summary</h2>
                    
                    <div className="user-info">
                        {reportType === 'Weekly' ? (
                            <p><strong>Selected Date Range:</strong> {getWeeklyDateRange(generatedReport.date_of_report)}</p>
                        ) : (
                            <p><strong>Selected Date:</strong> {getTime(generatedReport.date_of_report)}</p>
                        )}
                        <p><strong>Total No of New User:</strong> {generatedReport.new_user}</p>
                        <p><strong>Total Service Matched:</strong> {generatedReport.match_service}</p>
                        <p><strong>Number of Service Listing Created:</strong> {generatedReport.created_service}</p>
                        <p><strong>Most Viewed Service Listing:</strong> {getServiceName(generatedReport.most_viewed_service)}</p>
                        <p><strong>Number of New Favourite Added:</strong> {generatedReport.added_favourite}</p>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}

