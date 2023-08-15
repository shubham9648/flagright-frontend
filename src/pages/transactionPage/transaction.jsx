import './transaction.scss';
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import moment from "moment"
import { apiGETCall1 } from "../../utilities/siteApi"



const TransactionPage = () => {
    const navigate = useNavigate();

    // UseStates declaration ..
    const [selectedOption, setSelectedOption] = useState('option1');
    const [amount, setAmount] = useState();
    const [srNo, setSrNo] = useState();
    const [search, setSearch] = useState();
    const [to, setTo] = useState();
    const [from, setFrom] = useState();
    const [data, setData] = useState([])
    const [sort, setSort] = useState("createdAt = -1");


    const temp = localStorage.getItem("userDetails");
    var userDetails = JSON.parse(temp);

    useEffect(() => {
        // Checking whether the user logged in or not
        if (!userDetails) {
            alert("Please login first!");
            navigate("/");
            return
        }
        apiGETCall1(`/transaction?pageNo=1&pageSize=10&${amount && (`amount=${amount}`)}&${srNo && (`srNo=${srNo}`)}&${search && (`search=${search}`)}&${to && (`to=${to}`)}&${from && (`from=${from}`)}&${sort}&`, {}).then((res) => {
            setData(res.data.data)
        })
    }, [amount, srNo, search, to, from, selectedOption]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'option1') {
            setSort("createdAt=-1");
        }
        if (event.target.value === 'option2') {
            setSort("createdAt=1");
        }
        if (event.target.value === 'option3') {
            setSort("amountSort=1");
        }
        if (event.target.value === 'option4') {
            setSort("amountSort=-1");
        }
    };

    const handleStartJob = () => {
        apiGETCall1(`/transaction/startCron`, {}).then((res) => {
            console.log("data is ", res.data);
            alert(res.data.message)
        })
    }

    const handleStopJob = () => {
        apiGETCall1(`/transaction/stopCron`, {}).then((res) => {
            console.log("data is ", res.data);
            alert(res.data.message)
        })
    }

    const downloadCsv = () => {
        var response

        apiGETCall1(`/transaction/csvExport`, {}).then((res) => {
            console.log("data is ", res.data);
            response = res.data
            console.log("ertbnyntyu tbr", response)
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(new Blob([response]));
            // generating link ..
            const link = document.createElement('a');
            link.href = url;
            link.download = 'output.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            window.URL.revokeObjectURL(url);
        })
    }

    // To handle Pagination
    const PER_PAGE = 10;
    const handlePageClick = ({ selected: selectedPage }) => {
        apiGETCall1(`/transaction?pageSize=${PER_PAGE}&pageNo=${selectedPage + 1}&${amount && (`amount=${amount}`)}&${srNo && (`srNo=${srNo}`)}&${search && (`search=${search}`)}&${to && (`to=${to}`)}&${from && (`from=${from}`)}&${sort}$`, {}).then((res) => {
            console.log("data is ", res.data.data);
            setData(res.data.data)
        })
    };

    const currentPageData = data.data?.length > 0 && data.data.map((item) => (
        <tr key={item._id}>
            <td>{item?.ID}</td>
            <td>{item?.amount}</td>
            <td>{item?.type}</td>
            <td>{item?.originUser?.fullName}</td>
            <td>{item?.destinationUser?.fullName}</td>
            <td> {item?.description} </td>
            <td> {item?.originAmountDetails?.currency?.name} </td>
            <td> {item?.destinationAmountDetails?.currency?.name} </td>
            <td>{moment(item?.createdAt).format("MMM Do YYYY")}</td>
        </tr>
    ));

    const pageCount = Math.ceil((((data.totalCount) > 100) ? 100 : data.totalCount) / PER_PAGE);

    return (
        <>
            <div className='main-component'>
                <section className='heading'>
                    <div className='left'>
                        <h2>Transactions</h2>
                    </div>
                    <div className='right'>
                        <button onClick={handleStartJob}>Start CronJob</button>
                        <button onClick={handleStopJob}>End CronJob</button>
                        <button onClick={downloadCsv}>Download CSV</button>
                        <h3>Hi, {userDetails && userDetails?.data?.fullName}</h3>
                    </div>
                </section>

                <section className='search-component'>
                    <input type='text'
                        placeholder='Search'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='date'>
                        <label>From:</label>
                        <input type='date'
                            placeholder="From"
                            className="custom-placeholder"
                            onChange={(e) => setFrom(moment(e.target.value, 'YYYY-MM-DD').utc())}
                        />
                    </div>
                    <div className='date'>
                        <label>To:</label>
                        <input type='date'
                            placeholder="To"
                            className="custom-placeholder"
                            onChange={(e) => setTo(moment(e.target.value, 'YYYY-MM-DD').utc())}
                        />
                    </div>
                    <input type='text'
                        placeholder='Amount'
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input type='text'
                        placeholder='User ID'
                        onChange={(e) => setSrNo(e.target.value)}
                    />
                    <select value={selectedOption} onChange={handleOptionChange}>
                        <option value="option1">New to Old</option>
                        <option value="option2">Old to new</option>
                        <option value="option3">Amount low to high</option>
                        <option value="option4">Amount high to low</option>
                    </select>
                </section>
                <section className='table'>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Origin User</th>
                                <th>Destination User</th>
                                <th>Description</th>
                                <th>Origin Currency</th>
                                <th>Destination Currency</th>
                                <th>Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData}

                        </tbody>
                    </table>
                </section>
                <div className="pagination">
                    <ReactPaginate
                        previousLabel="Prev"
                        nextLabel="Next"
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        breakLabel=".."
                        forcePage={0}
                        marginPagesDisplayed={2}
                        renderOnZeroPageCount={null}
                        containerClassName={"pagination"}
                        previousLinkClassName={"pagination_link"}
                        nextLinkClassName={"pagination_link"}
                        disabledClassName={"pagination_link--disabled"}
                        activeClassName={"pagination_link--active"}
                    />
                </div>
                <br />

            </div>
        </>
    )
}

export default TransactionPage;