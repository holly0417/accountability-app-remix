package com.github.holly.accountability.tasks;
import com.github.holly.accountability.relationships.*;
import com.github.holly.accountability.user.AccountabilitySessionUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/api/tasks")
@ResponseBody
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("")
    public Page<TaskData> getAllTasks(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @RequestParam(required = false) List<Long> userIds,
            @RequestParam(
                    defaultValue = "APPROVED, PENDING, COMPLETED, IN_PROGRESS, REJECTED"
                    ) List<TaskStatus> statuses,
            @PageableDefault(size = 20)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "t.id", direction = Sort.Direction.DESC)}) Pageable pageable
    ){

        return taskService.getRelevantTasks(userIds, statuses, pageable, user.getId())
                .map(this::convertTaskToDto);
    }

    @GetMapping("/order-by-duration")
    public Page<TaskData> getTasksOrderByDuration(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @RequestParam(required = false) List<Long> userIds,
            @RequestParam TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable
    ){
        return taskService.getTasksByDuration(userIds, status, pageable, user.getId())
                .map(this::convertTaskToDto);
    }


    @GetMapping("/calculatePaymentCompleted")
    public TaskCalculator calculatePaymentCompleted(
            @AuthenticationPrincipal AccountabilitySessionUser user
    ){
        return taskService.getWageFromSeconds(TaskStatus.COMPLETED, user.getId());
    }

    @GetMapping("/calculatePaymentInProgress")
    public TaskCalculator calculatePaymentInProgress(
            @AuthenticationPrincipal AccountabilitySessionUser user
    ){
        return taskService.getWageFromSeconds(TaskStatus.IN_PROGRESS, user.getId());
    }

    @PostMapping("/add")
    public TaskData addTask(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @RequestBody TaskEditRequest request
    ){
        Task task = taskService.addNewTask(request, user.getId());
        return convertTaskToDto(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @PathVariable Long taskId
    ){
        if (!taskService.deleteTask(taskId, user.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Task does not exist.");
        }

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{taskId}")
    public TaskData editTask(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @PathVariable Long taskId,
            @RequestBody TaskEditRequest request
    ){

        Task task = taskService.editTask(taskId, user.getId(), request);
        return convertTaskToDto(task);
    }

    @PostMapping("/{taskId}/start")
    public TaskData startTask(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @PathVariable Long taskId
    ){

        Task task = taskService.validateUserTask(taskId, user.getId());

        if (taskService.startOrEndTask(task, "start")) {
            return convertTaskToDto(task);
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task has already started.");
    }

    @PostMapping("/{taskId}/end")
    public TaskData endTask(@AuthenticationPrincipal AccountabilitySessionUser user,
                            @PathVariable Long taskId){

        Task task = taskService.validateUserTask(taskId, user.getId());

        if (taskService.startOrEndTask(task, "end")) {
            return convertTaskToDto(task);
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task has already ended.");
    }

    @PostMapping("/{taskId}/process")
    public TaskData updateTaskStatus(@AuthenticationPrincipal AccountabilitySessionUser user,
                                     @PathVariable Long taskId,
                                     @RequestBody TaskStatusDto newStatus){

        Task task = taskService.checkIfValidTaskProcess(user.getId(), taskId, newStatus);

        if (task == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        TaskData taskDto = convertTaskToDto(task);

        if (newStatus.getStatus() == TaskStatus.APPROVED) {
            taskService.addTaskAsPayment(task.getUser().getId(), taskDto);
        }

        return taskDto;
    }

    private TaskData convertTaskToDto(Task task){

        TaskData taskDto = new TaskData();

        taskDto.setId(task.getId());
        taskDto.setDescription(task.getDescription());
        taskDto.setStatus(task.getStatus());
        taskDto.setUserId(task.getUser().getId());
        taskDto.setUserName(task.getUser().getUsername());

        if (task.getTimeStart() != null) {
            Duration duration;

            if (task.getTimeEnd() == null) {
                duration = Duration.between(task.getTimeStart(), LocalDateTime.now());

            } else {
                duration = Duration.between(task.getTimeStart(), task.getTimeEnd());
            }

            taskDto.setDuration(duration);

            long HH = duration.toHours();
            long MM = duration.toMinutesPart();
            long SS = duration.toSecondsPart();

            String timeInHH = String.format("%02d hours ", HH);
            String timeInMM = String.format("%02d minutes ", MM);
            String timeInSS = String.format("%02d seconds", SS);

            if (HH == 1) {
                timeInHH = "1 hour ";
            }

            if (MM == 1) {
                timeInMM = "1 minute ";
            }

            if (SS == 1) {
                timeInSS = "1 second";
            }

            String timeInHHMMSS = timeInHH.concat(timeInMM).concat(timeInSS);

            taskDto.setDurationNumber();
            taskDto.setDurationString(timeInHHMMSS);
        }

        return taskDto;
    }

}
