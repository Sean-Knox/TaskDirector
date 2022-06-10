import React, {useState} from 'react'
import './workItems.css'
import logo from './tf-logo.svg';


function statusBar(type, info, click, caret){

    let _name
    let _status
    let _style = 'work-item '
    _style += type 
    
    let _vis = {}
    
    if (type === 'scope'){
        _name = 'Scope'
        _status = 0
        _style += ' style5' 
    } else if (type === 'programme'){
        _name = info.prog_name
        _status = info.prog_status 
        _style += ' style4' 
    } else if (type === 'project'){
        _name = info.proj_name
        _status = info.proj_status  
        _style += ' style3'
    } else if (type === 'job'){
        _name = info.job_name
        _status = info.job_status  
        _style += ' style2'
    } else if (type === 'task'){
        _name = info.task_name
        _status = info.task_status
        _style += ' style1'
        _vis = {visibility: 'hidden'}
    }
    
    


    return(
        <div style={{verticalAlign: 'middle'}}>
            <div className='caret' style={_vis}>
                <img src={logo} alt='' width="18" height="18" onClick={e => toggleCaret(e, caret)}/>
            </div>
            <div  className='workStatus' onClick={click}>
                <div  style={{float: 'left'}} className={getDot(_status)}></div>
                <div  style={{float: 'left'}} className={_style}>{_name}</div>
            </div>
            <div style={{clear: 'both'}}></div>
        </div>
    )
}

function toggleCaret(e,fn){
    let el = e.target
    el.parentElement.parentElement.parentElement.querySelector(".nested").classList.toggle("active")
    el.classList.toggle("caret-up")
    fn()  
}

function getDot(status, selected) {
    var dot = "dot"
    if (status === 1){
        dot = dot + " dot-active"
    } else if (status === 2){
        dot = dot + " dot-complete"
    }

    if (selected >= 0 && status === selected){
        dot = dot + " dot-selected"
    }
    return dot           
}

function getIdField(type) {
    var idField;          
    if (type === 'scope'){
        idField = ''
    } else if (type === 'programme'){
        idField = 'prog_id'
    } else if (type === 'project'){ 
        idField = 'proj_id'
    } else if (type === 'job'){
        idField = 'job_id'
    } else if (type === 'task'){
        idField = 'task_id'
    }  
    return idField            
}

function getStatus(sum, n) {
    var status = 0   
    if (n > 0){
        var avg = sum / n
        if (avg === 2){status = 2} 
            else if (avg > 0){status = 1}

    }
    return status
}

function formatScope(data) {

    var scope = [];
    var prog = {prog_id: 0, prog_name: '', prog_status: 0, projects: []};
    var proj = {proj_id: 0, proj_name: '', proj_status: 0, jobs: []};
    var job = {job_id: 0, job_name: '', job_status: 0, tasks: []};
    var task = {task_id: 0, task_name: '', task_status:0 };
    data.forEach(function(x){
        if(x.prog_id !== prog.prog_id){
            prog = {prog_id: x.prog_id, prog_name: x.prog_name, projects: []}    
            scope.push(prog)   
        }

        if(x.proj_id && x.proj_id !== proj.proj_id){
            proj = {proj_id: x.proj_id, proj_name: x.proj_name, jobs: []}
            prog.projects.push(proj) 
        }

        if(x.job_id && x.job_id !== job.job_id){
            job = {job_id: x.job_id, job_name: x.job_name, tasks: []}
            proj.jobs.push(job) 
        }

        if(x.task_id && x.task_id !== task.task_id){
            task = {task_id: x.task_id, task_name: x.task_name, task_status: x.task_status }
            job.tasks.push(task) 
        }

    });


    scope.forEach(function(prog){
        var p_sum = 0
        var p_n = 0 
        prog.projects.forEach(function(proj){
            var j_sum = 0
            var j_n = 0            
            proj.jobs.forEach(function(job){
                var t_sum = 0
                var t_n = 0
                job.tasks.forEach(function(task){
                    t_sum += task.task_status
                    t_n += 1
                })
                job.job_status = getStatus(t_sum, t_n)
                j_sum += job.job_status
                j_n += 1
            })
            proj.proj_status = getStatus(j_sum, j_n)
            p_sum += proj.proj_status
            p_n += 1
        })
        prog.prog_status = getStatus(p_sum, p_n)

    })



    return scope;
}

class Task extends React.Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        var info = {
            id: this.props.info.task_id, 
            name: this.props.info.task_name,
            status: this.props.info.task_status}

        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        var pos = {
            top: currentTargetRect.top,
            right: currentTargetRect.right
        }

        this.props.onClick({
            info: info, 
            type: 'task', 
            pos: pos,
            status: this.props.info.task_status})
    }

    render() {
              
        return (
            <div className="indent">          
                {statusBar('task', this.props.info, this.handleClick, this.props.onCaret)} 
            </div>
          );
    }

}

class Job extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        var info = {
            id: this.props.info.job_id, 
            name: this.props.info.job_name,
            status: this.props.info.job_status
        }   

        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        var pos = {
            top: currentTargetRect.top,
            right: currentTargetRect.right
        }
        this.props.onClick({info: info, type: 'job', pos: pos})
    }

    render() {
        return (
            <div className="indent">
            
                {statusBar('job', this.props.info, this.handleClick, this.props.onCaret)} 

                <div  className="nested active">
                    {this.props.info.tasks.map((task) => {
                        if (this.props.showCompleted || task.task_status < 2){
                           return <Task key={task.task_id} info={task} onClick={this.props.onClick} onCaret={this.props.onCaret}/>
                        }
                        return null
                    })}  
                </div>

            </div>
          );
    }

}

class Project extends React.Component {
    constructor(props) {
        super(props);
         this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        var info = {
            id: this.props.info.proj_id, 
            name: this.props.info.proj_name,
            status: this.props.info.proj_status
        }

        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        var pos = {
            top: currentTargetRect.top,
            right: currentTargetRect.right
        }

        this.props.onClick({info: info, type: 'project', pos: pos})
    }

    render() {
        return (
            
            <div className="indent">
            
                {statusBar('project', this.props.info, this.handleClick, this.props.onCaret)} 

                <div className="nested active">
                    {this.props.info.jobs.map(job => {
                        if (this.props.showCompleted || job.job_status < 2){
                           return <Job key={job.job_id} info={job} onClick={this.props.onClick} onCaret={this.props.onCaret} showCompleted={this.props.showCompleted}/>
                        }
                        return null
                    })}  
                </div>

            </div>

          );
    }

}

class Programme extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {

        var info = {
            id: this.props.info.prog_id, 
            name: this.props.info.prog_name,
            status: this.props.info.prog_status
        }

        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        var pos = {
            top: currentTargetRect.top,
            right: currentTargetRect.right
        }

        this.props.onClick({info: info, type: 'programme', pos: pos })
    }
    
    render() {
              
        return (

                <div className="indent">
            
                    {statusBar('programme', this.props.info, this.handleClick, this.props.onCaret)} 

                    <div className="nested active">

                        {this.props.info.projects.map(project => {
                         if (this.props.showCompleted || project.proj_status < 2){
                           return <Project key={project.proj_id} info={project}  onClick={this.props.onClick} onCaret={this.props.onCaret} showCompleted={this.props.showCompleted}/>
                         }
                         return null
                         })} 

                    </div>

                </div>

          );
    }

}

export default class Scope extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          openModal: false,
          showCompleted: true,
          info: {id: 0, name: ''},
          type: '',
          scope: []
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.postApi = this.postApi.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentDidMount() {this.postApi('getScope')}

    closeModal(){this.setState ({openModal:false})}

    handleOpenModal (e) {
        this.setState ({openModal:true, info: e.info, type: e.type, pos: e.pos})
    }

    handleChange(data){this.setState ({scope:data, openModal: false})}

    postApi(api, body){
        
        //alert('apiPost')

        let requestOptions

        if (body){
            requestOptions = {
                method: 'POST',
                body: JSON.stringify(body)}       
        } else {
            requestOptions = {method: 'GET'}           
        }

        requestOptions['headers'] = {'authorization': localStorage.getItem('token'),
                          'Content-type': 'application/json' }

        fetch('http://localhost:4001/' + api, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({scope: formatScope(data), openModal: false})
            })
            .catch(error => {
                alert('Error in postApi : ' + error + ' api=' + api +  ' body=' + JSON.stringify(body))
            })

    }

    handleClick(e){
        var info = {
            id: 0, 
            name: 'Scope',
            status: 0
        }

        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        var pos = {
            top: currentTargetRect.top,
            right: currentTargetRect.right
        }
        this.handleOpenModal({info: info, type: 'scope', pos: pos })
    }
    
    toggleShow(){
        this.setState({showCompleted: !this.state.showCompleted})
    }

    render() {

      return (
                
          <div>        
          
            <StatusFilter showCompleted={this.state.showCompleted} toggle={this.toggleShow}/>

            <div className="indent">
          
                {statusBar('scope', '', this.handleClick, this.closeModal)} 

                <div className="nested active">
                    {this.state.scope.map(programme => {
                        if (this.props.showCompleted || programme.prog_status < 2){
                           return <Programme key={programme.prog_id} info={programme} onClick={this.handleOpenModal} onCaret={this.closeModal} showCompleted={this.state.showCompleted}/>
                        }
                        return null
                        }
                    )}  
                </div>

                <InfoModal key={this.state.openModal + this.state.info.id + this.state.type} isOpen={this.state.openModal} info={this.state.info} pos={this.state.pos} type={this.state.type} onPost={this.postApi} onClose={this.closeModal}/>

            </div>

            
          </div>
      );

    }

}

class InfoModal extends React.Component { 
    
    constructor(props) {
        super(props)
        this.state = {
            description: ''
        }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
    } 

    componentDidMount() {

        if (!this.props.isOpen){return}

        const body = {
            table: this.props.type + 's',
            idField: getIdField(this.props.type),
            id: this.props.info.id
        }

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'authorization': localStorage.getItem('token'),
                      'Content-type': 'application/json' }
        }       

        fetch('http://localhost:4001/getDetail', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({description: data[0]['description'] })
            })
            .catch(error => {
                alert('Error in getDetail: ' + error)
            })

    }

    handleDelete(e){
        e.preventDefault() 

        const body = {
            table: this.props.type + 's', 
            idField: getIdField(this.props.type) ,
            id: this.props.info.id
        }

        if (window.confirm('Are you sure you wish to delete this item and all its children?')){
            this.props.onPost('deleteWorkItem', body)
        }


    }

    handleAdd(e){
        e.preventDefault()

        var child

        if (this.props.type === 'scope'){
            child = 'programme'
        } else if (this.props.type === 'programme'){
            child = 'project'
        } else if (this.props.type === 'project'){
            child = 'job'   
        } else if (this.props.type === 'job'){
            child = 'task' 
        }

        const body = {
            table: child + 's', 
            idField: getIdField(this.props.type),
            id: this.props.info.id,
            name : 'new ' + child
        };

        this.props.onPost('addWorkItem', body)         

    }

    handleEdit(e){

        e.preventDefault()

        const body = {
            table: this.props.type + 's', 
            idField: getIdField(this.props.type),
            id: this.props.info.id,
            name: e.currentTarget.elements.name.value,
            description: e.currentTarget.elements.description.value
        };

        this.props.onPost('editWorkItem', body)

    }

    updateStatus(e){

        var i = parseInt(e.target.getAttribute('data-status'))
        const body = {
            status: i,
            id: this.props.info.id,
        }               
        this.props.onPost('updateStatus', body)                
    }

    render() {               

        if(!this.props.isOpen) { 
            return (<div></div>) 
        } 

        let btnAdd
        let btnDelete
        let btn_txt
        let form                
        let status


        if(this.props.type !== 'scope'){
            btnDelete = <button  className="btn btn-secondary" onClick={this.handleDelete}>Delete</button>

            form = 
            <div>
                <form onSubmit={this.handleEdit}>

                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input className="form-control" type="text" id='name' defaultValue={this.props.info.name} required></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" id='description' defaultValue={this.state.description}></textarea >
                    </div>
                    <input className="btn btn-secondary" type="submit" value="Update"></input>
                </form>
            </div>

            var i = this.props.info.status
            if (this.props.type === 'task'){
                status =
                    <div>
                        <span data-status='0' className={getDot(0,i)} onClick={this.updateStatus}></span>
                        <span data-status='1' className={getDot(1,i)} onClick={this.updateStatus}></span>
                        <span data-status='2' className={getDot(2,i)} onClick={this.updateStatus}></span>
                    </div>

            } else {
                status = <span className={getDot(i)}></span>
            }
        }

        var style3 = " "

        if (this.props.type !== 'task'){
            switch(this.props.type){
                case 'scope':
                    btn_txt = ' Programme'
                    style3 = style3 + 'style5'
                    break;
                case 'programme':
                    btn_txt = ' Project'
                    style3 = style3 + 'style4'
                    break;
                case 'project':
                    btn_txt = ' Job'
                    style3 = style3 + 'style3'
                    break;
                case 'job':
                    btn_txt = ' Task'
                    style3 = style3 + 'style2'
                    break;
                default:                           
                    btn_txt = ''
            }                                       
            btnAdd = <button  className="btn btn-secondary" onClick={this.handleAdd}>+{btn_txt}</button>                
        } else {
            style3 = style3 + 'style1'
        }    

        var style={top: this.props.pos.top + 'px', left: this.props.pos.right + 5 + 'px'}



        return (             
            <div id='myModal' className="modal modal-open" style={style}>

                <div className="modal-dialog">
                    <div className="modal-content" >

                        <div className={"modal-header " + style3}>
                            {status}
                            <button className="close" type="button"  aria-label="Close"  onClick={this.props.onClose}> 
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            {form}
                        </div>

                        
                        <div className="modal-footer">
                            {btnDelete}
                            {btnAdd}
                        </div>
                    </div>
                </div>
            
            </div>
        )                
    }                               
}
        
class StatusFilter extends React.Component {

  
    render() {
        
        var className = 'status-filter'
        if(!this.props.showCompleted){className = className + ' status-filter-up'}
                                        
        return (
            <div style={{'width': '30px'}}>
                <svg className={className} viewBox='0 0 100 100' onClick={this.props.toggle}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6B8EB7" strokeWidth="10"/>         
                    <polygon points="25,30 75,30 50,80" fill="none"  stroke="#B5B7BB"  strokeWidth="10"/>
                </svg>
            </div>

          )
    }

}
